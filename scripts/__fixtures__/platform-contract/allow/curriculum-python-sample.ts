// ALLOWED FIXTURE — curriculum teaching material.
// A Python code sample inside a string literal teaches students to store keys
// in environment variables. This is NOT Bhavya configuration.
export const lesson = {
  title: "Using an API safely",
  code: 'import os\nfrom openai import OpenAI\n\nclient = OpenAI(api_key=os.environ["OPENAI_API_KEY"])\nprint(client)',
};
