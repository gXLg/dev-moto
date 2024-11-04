const OpenAI = require("openai");
const { apiKey } = require("../config.json");
const fs = require("fs");

const openai = new OpenAI({ apiKey });

module.exports = async req => {

  let notes;
  try {
    notes = fs.readFileSync("./data/notes.md", "utf8");
  } catch {
    notes = "(No notes yet)";
  }
  const init = fs.readFileSync("./data/initial_plan.json", "utf8");
  const history = JSON.parse(fs.readFileSync("./data/adjustments.json")).join("\n---\n");
  const final = fs.readFileSync("./data/current_plan.json", "utf8");
  const feedback = req.body.feedback;

  const system = fs.readFileSync("./ai/summarise.md", "utf8");

  const user = fs.readFileSync("./ai/summarise-message.md", "utf8")
    .replace("{notes}", notes)
    .replace("{init}", init)
    .replace("{history}", history)
    .replace("{final}", final)
    .replace("{feedback}", feedback);

  console.log("summarise: running completion");
  const completion = await openai.beta.chat.completions.parse({
    "model": "gpt-4o-2024-08-06",
    "messages": [
      { "role": "system", "content": system },
      { "role": "user", "content": user },
    ],
    "temperature": 0.2,
    "top_p": 0.5
  });
  console.log("summarise: completion completed");

  fs.writeFileSync("./data/notes.md", completion.choices[0].message.content);
};
