const OpenAI = require("openai");
const { apiKey } = require("../config.json");
const fs = require("fs");

const openai = new OpenAI({ apiKey });

module.exports = async req => {
  if (req.auth == null) return;
  const username = req.auth;

  let notes;
  try {
    notes = fs.readFileSync("./data/" + username + "_notes.md", "utf8");
  } catch {
    notes = "(No notes yet)";
  }
  const fixed = req.body.fixed;
  const other = req.body.other;

  const system = fs.readFileSync("./ai/planner.md", "utf8")
    .replace("{notes}", notes);

  const user = fs.readFileSync("./ai/planner-message.md", "utf8")
    .replace("{fixed}", fixed)
    .replace("{other}", other);

  console.log("planner: running completion", username);
  const completion = await openai.beta.chat.completions.parse({
    "model": "gpt-4o-2024-08-06",
    "messages": [
      { "role": "system", "content": system },
      { "role": "user", "content": user },
    ],
    "temperature": 0.2,
    "top_p": 0.5,
    "response_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "timetable",
        "schema": {
          "type": "object",
          "properties": {
            "timetable": {
              "type": "array",
              "description": "A list of activities scheduled throughout the week.",
              "items": {
                "type": "object",
                "properties": {
                  "day": {
                    "type": "string",
                    "description": "The short name of the day of the week",
                    "enum": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                  },
                  "time": {
                    "type": "string",
                    "description": "The time period for this activity in HH:MM - HH:MM format."
                  },
                  "name": {
                    "type": "string",
                    "description": "A short name of the activity."
                  }
                },
                "required": [
                  "day",
                  "time",
                  "name"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": ["timetable"],
          "additionalProperties": false
        },
        "strict": true
      }
    }
  });
  console.log("planner: completion completed", username);

  fs.writeFileSync("./data/" + username + "_current_plan.json", completion.choices[0].message.content);
  fs.writeFileSync("./data/" + username + "_initial_plan.json", completion.choices[0].message.content);
  fs.writeFileSync("./data/" + username + "_adjustments.json", JSON.stringify([
    "Before the start of the week:\n" +
    "Fixed commitments: " + fixed + "\n\n" +
    "Other goals: " + other + "\n"
  ]));
};
