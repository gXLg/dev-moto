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
  let time;
  if (req.body.time == "now" || req.body.time == "") {
    const n = new Date();
    const d = ["Sunday", "Monday", "Wednesday", "Thursday", "Friday", "Saturday"][n.getDay()];
    const h = n.getHours().toString().padStart(2, "0");
    const m = n.getMinutes().toString().padStart(2, "0");
    time = d + " " + h + ":" + m;
  } else if (req.body.time == "before") {
    time = "Before the start of the week";
  } else {
    time = req.body.time;
  }
  const table = fs.readFileSync("./data/" + username + "_current_plan.json", "utf8");
  const feedback = req.body.feedback;
  const history = JSON.parse(fs.readFileSync("./data/" + username + "_adjustments.json")).join("\n---\n");

  const system = fs.readFileSync("./ai/adjust.md", "utf8")
    .replace("{notes}", notes);

  const user = fs.readFileSync("./ai/adjust-message.md", "utf8")
    .replace("{time}", time)
    .replace("{history}", history)
    .replace("{table}", table)
    .replace("{feedback}", feedback);

  console.log("adjust: running completion", user);
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
  console.log("adjust: completion completed", username);

  fs.writeFileSync("./data/" + username + "_current_plan.json", completion.choices[0].message.content);

  history.push(time + ": " + feedback);
  fs.writeFileSync("./data/" + username + "_adjustments.json", JSON.stringify(history));
};
