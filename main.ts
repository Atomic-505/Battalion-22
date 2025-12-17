// main.ts — Discord bot using FREE Hugging Face AI
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
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get("HF_API_KEY")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `User: ${msg.content}\nAssistant:`,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7
          }
        })
      }
    );

    const data = await response.json();

    // Hugging Face returns an array
    const aiText =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text.replace(/.*Assistant:/s, "").trim()
        : "⚠️ The AI did not respond.";

    await msg.reply(aiText);

  } catch (err) {
    console.error(err);
    await msg.reply("❌ Error contacting Hugging Face AI.");
  }
});

client.login(Deno.env.get("DISCORD_TOKEN"));
