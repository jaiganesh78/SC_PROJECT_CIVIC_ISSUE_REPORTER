const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// STRICT ENUMS
const ALLOWED_CATEGORIES = [
  "garbage_overflow",
  "pothole",
  "water_stagnation",
  "drainage_overflow",
  "street_light_failure",
  "hospital_infrastructure",
  "other",
];

const ALLOWED_PRIORITIES = [30, 50, 70, 90];

async function analyzeIssueWithAI({ raw_description, vision_labels = [] }) {
  const systemPrompt = `
You are an AI assistant for a civic issue reporting platform.

You MUST return STRICT JSON only. No markdown. No extra text.

TASKS:
1. Summarize the issue in ONE clear sentence (max 20 words).
2. Classify the issue into ONE allowed category.
3. Assign a numeric priority score based ONLY on the ORIGINAL description severity.

RULES:
- Allowed categories ONLY:
  ${ALLOWED_CATEGORIES.join(", ")}
- Allowed priority scores ONLY:
  30 (LOW), 50 (MEDIUM), 70 (HIGH), 90 (CRITICAL)
- Priority MUST be decided from ORIGINAL description, NOT summary.
- Higher priority for:
  - hospital infrastructure
  - emergencies, danger, accidents, children
  - sewage overflow, flooding, fire

OUTPUT JSON FORMAT:
{
  "summary": "",
  "category": "",
  "confidence": 0.0,
  "priority_score": 0,
  "reasoning": ""
}
`;

  const userPrompt = `
Original Description:
"${raw_description}"

Image Context Labels:
${vision_labels.join(", ")}
`;

  let content;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    content = completion.choices[0].message.content;
  } catch (err) {
    console.error("GROQ API ERROR:", err);
    throw new Error("AI_SERVICE_FAILED");
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error("GROQ RAW RESPONSE:", content);
    throw new Error("AI_INVALID_JSON");
  }

  // HARD VALIDATION (DO NOT TRUST AI BLINDLY)
  if (
    !ALLOWED_CATEGORIES.includes(parsed.category) ||
    !ALLOWED_PRIORITIES.includes(parsed.priority_score) ||
    typeof parsed.confidence !== "number"
  ) {
    throw new Error("AI_INVALID_OUTPUT");
  }

  return {
    summary: parsed.summary,
    category: parsed.category,
    ai_confidence: parsed.confidence,
    priority_score: parsed.priority_score,
    reasoning: parsed.reasoning,
  };
}

module.exports = { analyzeIssueWithAI };
