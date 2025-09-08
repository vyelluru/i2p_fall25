import { spawn } from "child_process";
function sendRequest(proc, id, method, params) {
    const request = { jsonrpc: "2.0", id, method, params };
    const body = JSON.stringify(request);
    const msg = `Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n\r\n${body}`;
    if (proc.stdin) {
        proc.stdin.write(msg);
    }
    else {
        console.error("Error: proc.stdin is null");
    }
}
const server = spawn("npx", ["ts-node", "src/server.ts"]);
server.stdout.on("data", (chunk) => {
    console.log("<<<", chunk.toString());
});
server.stderr.on("data", (chunk) => {
    console.error("SERVER ERR:", chunk.toString());
});
setTimeout(() => {
    // Call the "add" tool
    sendRequest(server, 1, "tools/call", {
        name: "add",
        arguments: { a: 2, b: 3 },
    });
    // Read the "greeting" resource
    sendRequest(server, 2, "resources/read", {
        uri: "greeting://World",
    });
}, 500);
// Kill the server after a few seconds
setTimeout(() => server.kill(), 3000);
