import os
import discord
from discord.ext import commands
from openai import OpenAI

# Get environment variables from Railway (it handles them automatically)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")

client = OpenAI(api_key=OPENAI_API_KEY)

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")

@bot.command()
async def ask(ctx, *, prompt):
    """Ask the bot something using ChatGPT"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful Discord bot."},
                {"role": "user", "content": prompt}
            ]
        )
        answer = response.choices[0].message.content
        await ctx.reply(answer)

    except Exception as e:
        await ctx.reply(f"❌ Error: {e}")

bot.run(DISCORD_TOKEN)
