// // testClient.ts
// import { McpClient } from "@modelcontextprotocol/sdk/client/mcp.js";
// import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// import { spawn } from "child_process";

// async function main() {
//   // Spawn the server as a subprocess
//   const serverProcess = spawn("node", ["server.js"]);

//   const transport = new StdioClientTransport({
//     stdin: serverProcess.stdin!,
//     stdout: serverProcess.stdout!,
//   });

//   const client = new McpClient(transport);

//   await client.connect();

//   // Test the "add" tool
//   const addResult = await client.callTool("add", { a: 2, b: 3 });
//   console.log("Add result:", addResult);

//   // Test the "greeting" resource
//   const greeting = await client.readResource("greeting://World");
//   console.log("Greeting result:", greeting);

//   serverProcess.kill();
// }

// main();