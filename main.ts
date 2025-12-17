// main.ts — Discord bot using FREE DeepSeek AI
import { Client, GatewayIntentBits } from "npm:discord.js@14";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("DEEPSEEK_API_KEY")}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "user", content: msg.content }
        ]
      })
    });

    const data = await response.json();
    const aiReply =
      data?.choices?.[0]?.message?.content ??
      "⚠️ The AI did not return a response.";

    await msg.reply(aiReply);

  } catch (err) {
    console.error(err);
    await msg.reply("❌ Error contacting the AI service.");
  }
});

client.login(Deno.env.get("DISCORD_TOKEN"));

