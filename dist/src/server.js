import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({ name: "demo-server", version: "1.0.0" });
server.tool("add", "Add two numbers", { a: z.number(), b: z.number() }, async ({ a, b }) => ({ content: [{ type: "text", text: String(a + b) }] }));
(async () => {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP server connected");
    // Keep the process alive by keeping stdin in flowing mode.
    // This is the simplest reliable keep-alive for stdio-based MCP servers.
    process.stdin.resume();
    // (Optional) also keep a long timer as a backstop:
    // setInterval(() => {}, 1 << 30);
})().catch((e) => {
    console.error("Server fatal error:", e?.stack ?? e);
    process.exit(1);
});
// Never log to stdout (reserved for MCP protocol)
console.error("Server is starting...");
