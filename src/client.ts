import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "python",
  args: ["-m", "mcp_server_time"],
  stderr: "ignore",
});

const client = new Client(
    { name: "mcp-security", version: "1.0.0" }, 
  );
  

function parseToolJson(res: any) {
    const text = res?.content?.find((c: any) => c.type === "text")?.text ?? "";
    return JSON.parse(text);
}


async function main(){

    await client.connect(transport);

    var currTimeRes = await client.callTool({
        name: "get_current_time",
        arguments: { timezone: "America/New_York" }
    });

    currTimeRes = parseToolJson(currTimeRes);
    console.log("Warsaw:", currTimeRes.timezone, currTimeRes.datetime, currTimeRes.is_dst);

    const convertedRes = await client.callTool({
        name: "convert_time",
        arguments: {
            source_timezone: "America/New_York",
            time: "14:00",
            target_timezone: "Asia/Tokyo",
        },
    });

    const converted = parseToolJson(convertedRes);
    console.log("Converted:", converted.time_difference, converted.target.datetime);
}
main();