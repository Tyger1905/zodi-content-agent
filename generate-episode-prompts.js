import OpenAI from "openai";
import fs from "fs";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const episode1 = fs.readFileSync("story/episode1.txt", "utf8");
const characterBible = fs.readFileSync("story/character-bible.txt", "utf8");

async function generateEpisodePrompts() {
  try {
    console.log("Generating Episode 1 video prompts...");

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions:
        "You are a professional movie writer, AI video prompt engineer, and cinematic scene director.",
      input: `
Use the story and character bible below to create AI video prompts for Episode 1.

CHARACTER BIBLE:
${characterBible}

EPISODE 1 SCRIPT:
${episode1}

Create a scene-by-scene production prompt package.

For each scene include:
1. Scene number
2. Scene title
3. Duration target: 5-8 seconds
4. Cinematic video prompt
5. Camera movement
6. Lighting
7. Character details
8. Action
9. Negative prompt
10. Voiceover/dialogue line if needed

Rules:
- Keep ZODI original.
- Do not copy Marvel, DC, Power Rangers, or existing franchises.
- Every combat version must include hoodie up, Z-VIS AI glasses, and original high-top sneaker silhouette.
- Make it realistic, dark, cinematic, premium, and grounded.
- Prompts must be ready to paste into Runway, Kling, Pika, or Sora.
`,
    });

    const output = response.output_text;

    if (!fs.existsSync("outputs")) {
      fs.mkdirSync("outputs");
    }

    fs.writeFileSync("outputs/episode1-video-prompts.txt", output);

    console.log("Done.");
    console.log("Saved: outputs/episode1-video-prompts.txt");
  } catch (error) {
    console.error("Failed:");
    console.error(error.message);
  }
}

generateEpisodePrompts();