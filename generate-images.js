import OpenAI from "openai";
import fs from "fs";
import path from "path";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const characters = JSON.parse(fs.readFileSync("characters.json", "utf8"));

const outputDir = "outputs/images";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function buildImagePrompt(character) {
  return `
Create a realistic cinematic character concept image for the original teen superhero series ZODI.

Character:
Name: ${character.name}
Age: ${character.age}
Zodiac: ${character.zodiac}
Personality: ${character.personality}
Power: ${character.power}
Suit design: ${character.suit}

Visual rules:
- Ultra-realistic modern teenager
- Premium luxury black tracksuit
- Futuristic but believable
- No mask
- No cape
- No comic-book style
- No Marvel, DC, Power Rangers, anime, or existing franchise influence
- High-end cinematic lighting
- Dark city background at night
- Full body shot
- Fashion editorial pose
- Emotional serious expression
- The suit should look like something that could become a real clothing brand
`;
}

async function generateImage(character) {
  console.log(`Generating image for ${character.name}...`);

  const result = await client.images.generate({
    model: "gpt-image-1",
    prompt: buildImagePrompt(character),
    size: "1024x1536"
  });

  const imageBase64 = result.data[0].b64_json;
  const imageBuffer = Buffer.from(imageBase64, "base64");

  const safeName = `${character.name}-${character.zodiac}`.toLowerCase();
  const filePath = path.join(outputDir, `${safeName}.png`);

  fs.writeFileSync(filePath, imageBuffer);

  console.log(`Saved: ${filePath}`);
}

async function main() {
  try {
    for (const character of characters) {
      await generateImage(character);
    }

    console.log("V2 image generation complete.");
  } catch (error) {
    console.error("Image generation failed:");
    console.error(error.message);
  }
}

main();