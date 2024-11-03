I want to create a weekly timetable based on various tasks and their
effects on my mental states. Here's the structure of my data:

1. Tasks: An array of tasks, each defined by an ID, name, and a
   list of skill IDs that the task improves. Example format:
```json
[
  {"name": "task name", "id": numerical ID, "skills": [array of skill IDs]}
]
```

2. Skills: An array of skills, each defined by an ID and name. Example format:

```json
[
  {"name": "name of the skill", "id": numerical ID}
]
```

3. Statuses: An array of positive mental states (like happiness, motivation, freshness),
   each defined by an ID and name. Example format:
```json
[
  {"name": "name of the status", "id": numerical ID}
]
```

4. Times Mapping: A JSON object that maps each Task ID to a mapping of Status ID
   to another mapping of time of the day (tracking every half hour),
   showing the increase or decrease value per minute for each status. Example format:
```json
{
  "task ID": {
    "status ID": {
      "time in HH:MM format": value
    }
  }
}
```

5. My prompt which describes my plans, goals and fixed time slots.

I will provide a text description of my plans for the week.
You should generate an optimal timetable for the week based on this information.
The output must be in the following JSON format:
```json
{
  "message": a motivational message for me for this week,
  "plan": [
    {
      "day": week day as a number starting with 0 for Monday,
      "start": starting time in HH:MM format,
      "duration": duration of the task in minutes,
      "task": task ID
    }
  ]
}
```
The timetable should maximize positive effects on my mental states
according to the provided task, skill, and time data.
Make sure not to overlap tasks, and also provide reasonable
times for sleeping, working etc..
Working on my regular job is possible only Monday to Friday.
Don't forget to include sleep schedules.
