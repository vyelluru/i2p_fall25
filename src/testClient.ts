// src/testClient.ts
import { spawn } from "child_process";

import { ChildProcess } from "child_process";

function sendRequest(proc: ChildProcess, id: number, method: string, params: any) {
  const request = { jsonrpc: "2.0", id, method, params };
  const body = JSON.stringify(request);
  const msg = `Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n\r\n${body}`;
  if (proc.stdin) {
    proc.stdin.write(msg);
  } else {
    console.error("Error: proc.stdin is null");
  }
}

// Spawn the compiled JS server
const server = spawn("node", ["dist/server.js"], { stdio: "pipe" });

server.stdout.on("data", (chunk) => {
  console.log("<<<", chunk.toString());
});

server.stderr.on("data", (chunk) => {
  console.error("SERVER ERR:", chunk.toString());
});

setTimeout(() => {
  // Call the "add" tool
  sendRequest(server, 1, "tools/call", { name: "add", arguments: { a: 2, b: 3 } });

  // Call the "greeting" resource
  sendRequest(server, 2, "resources/read", { uri: "greeting://World" });
}, 500);

setTimeout(() => server.kill(), 3000);
