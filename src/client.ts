import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "python",
  args: ["-m", "mcp_server_time"],
  stderr: "ignore",
});

const client = new Client(
    { name: "demo-client", version: "1.0.0" }, // <-- first arg must have name/version
  );
  

function parseToolJson(res: any) {
const text = res?.content?.find((c: any) => c.type === "text")?.text ?? "";
return JSON.parse(text);
}


async function main(){

    await client.connect(transport);

    const warsawRes = await client.callTool({
        name: "get_current_time",
        arguments: { timezone: "Europe/Warsaw" }
    });

    const warsaw = parseToolJson(warsawRes);
    console.log("Warsaw:", warsaw.timezone, warsaw.datetime, warsaw.is_dst);

    const convertedRes = await client.callTool({
        name: "convert_time",
        arguments: {
            source_timezone: "America/New_York",
            time: "16:30",
            target_timezone: "Asia/Tokyo",
        },
    });

    const converted = parseToolJson(convertedRes);
    console.log("Converted:", converted.time_difference, converted.target.datetime);
}
main();