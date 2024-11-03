const OpenAI = require("openai");
const { apiKey } = require("../config.json");
const fs = require("fs");

const openai = new OpenAI({ apiKey });

module.exports = async req => {
  const tasks = JSON.parse(fs.readFileSync("./data/tasks.json"));
  const skills = JSON.parse(fs.readFileSync("./data/skills.json")).map(r => {
    const { name, id } = r;
    return { name, id };
  });
  const status = JSON.parse(fs.readFileSync("./data/status.json")).map(r => {
    const { name, id } = r;
    return { name, id };
  });;
  const rtimes = JSON.parse(fs.readFileSync("./data/times.json"));
  const times = { };
  for (const t in times) {
    const tt = { };
    for (const s in times[t]) {
      const ss = { };
      for (const m in times[t][s]) {
        const [a, b] = times[t][s][m];
        const time = [parseInt(m / 60), m % 60].map(s => s.toString().padStart(2, "0")).join(":");
        ss[time] = a / b;
      }
      tt[s] = ss;
    }
    times[t] = tt;
  }
  const plan = req.body.prompt;

  const prompt = fs.readFileSync("./lib/prompt.md", "utf8")
    .replace("{tasks}", JSON.stringify(tasks))
    .replace("{skills}", JSON.stringify(skills))
    .replace("{status}", JSON.stringify(status))
    .replace("{times}", JSON.stringify(times))
    .replace("{plan}", plan);

  console.log("running completion");
  const completion = await openai.beta.chat.completions.parse({
    "model": "gpt-4o-2024-08-06",
    "messages": [
      { "role": "system", "content": fs.readFileSync("./lib/system.md", "utf8") },
      { "role": "user", "content": prompt },
    ],
    "response_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "weekly_motivation_and_plan",
        "schema": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "description": "A motivational message for the week."
            },
            "plan": {
              "type": "array",
              "description": "Planned tasks for each day of the week.",
              "items": {
                "type": "object",
                "properties": {
                  "day": {
                    "type": "number",
                    "description": "The day of the week as a number (0 = Monday)."
                  },
                  "start": {
                    "type": "string",
                    "description": "Starting time in HH:MM format."
                  },
                  "duration": {
                    "type": "number",
                    "description": "Duration of minutes to do this task."
                  },
                  "task": {
                    "type": "number",
                    "description": "ID of the task."
                  }
                },
                "required": [
                  "day",
                  "start",
                  "duration",
                  "task"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "message",
            "plan"
          ],
          "additionalProperties": false
        },
        "strict": true
      }
    }
  });

  fs.writeFileSync("./data/current_plan.json", completion.choices[0].message.content);
};
