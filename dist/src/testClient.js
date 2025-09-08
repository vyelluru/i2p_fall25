// src/testClient.ts
import { spawn } from "child_process";
function send(proc, obj) {
    const body = JSON.stringify(obj);
    const msg = `Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n\r\n${body}`; // <- CRLF
    if (!proc.stdin)
        return console.error("Error: proc.stdin is null");
    proc.stdin.write(msg);
}
function attachReader(proc, onMessage) {
    let buf = Buffer.alloc(0);
    proc.stdout?.on("data", (chunk) => {
        buf = Buffer.concat([buf, chunk]);
        while (true) {
            const headerEndCRLF = buf.indexOf("\r\n\r\n");
            if (headerEndCRLF === -1)
                break; // wait for full header
            const header = buf.slice(0, headerEndCRLF).toString("utf8");
            const m = header.match(/Content-Length:\s*(\d+)/i);
            if (!m) {
                // Drop malformed header
                buf = buf.slice(headerEndCRLF + 4);
                continue;
            }
            const len = Number(m[1]);
            const bodyStart = headerEndCRLF + 4;
            const bodyEnd = bodyStart + len;
            if (buf.length < bodyEnd)
                break; // wait for full body
            const body = buf.slice(bodyStart, bodyEnd).toString("utf8");
            buf = buf.slice(bodyEnd);
            try {
                onMessage(JSON.parse(body));
            }
            catch (e) {
                console.error("Failed to parse JSON:", e, "body:", body);
            }
        }
    });
    proc.stderr?.on("data", (chunk) => console.error("SERVER ERR:", chunk.toString()));
    proc.on("exit", (code, signal) => console.error(`Server exited (code=${code}, signal=${signal ?? ""})`));
}
function sendInitialize(proc, id = 1) {
    send(proc, {
        jsonrpc: "2.0",
        id,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            clientInfo: { name: "test-client", version: "0.0.1" },
            capabilities: {}
        }
    });
}
function sendInitialized(proc) {
    send(proc, { jsonrpc: "2.0", method: "notifications/initialized", params: {} });
}
function callAdd(proc, id = 2, a = 2, b = 3) {
    send(proc, { jsonrpc: "2.0", id, method: "tools/call", params: { name: "add", arguments: { a, b } } });
}
// --- Run ---
const server = spawn("node", ["dist/server.js"], { stdio: ["pipe", "pipe", "pipe"] });
attachReader(server, (msg) => {
    console.log("<<<", JSON.stringify(msg));
});
// Handshake then call (give the server time to connect)
setTimeout(() => sendInitialize(server, 1), 150);
setTimeout(() => sendInitialized(server), 350);
setTimeout(() => callAdd(server, 2, 2, 3), 600);
// Give responses time, then close stdin (graceful)
setTimeout(() => server.stdin?.end(), 5000);
// Hard kill fallback
setTimeout(() => { try {
    server.kill();
}
catch { } }, 9000);
