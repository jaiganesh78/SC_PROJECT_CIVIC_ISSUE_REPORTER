/*const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const HF_API_URL =
  "https://router.huggingface.co/hf-inference/models/openai/clip-vit-base-patch32";

// MUST MATCH TEXT CATEGORIES EXACTLY
const CATEGORIES = [
  "garbage_overflow",
  "pothole",
  "water_stagnation",
  "drainage_overflow",
  "street_light_failure",
  "hospital_infrastructure",
  "other",
];

// Convert category → human readable prompt
const CATEGORY_PROMPTS = {
  garbage_overflow: "a photo of garbage overflow on the street",
  pothole: "a photo of a pothole on the road",
  water_stagnation: "a photo of stagnant water on a street",
  drainage_overflow: "a photo of sewage or drainage overflow",
  street_light_failure: "a photo of a broken street light",
  hospital_infrastructure: "a photo of a hospital or public medical building",
  other: "a photo unrelated to civic infrastructure",
};

async function analyzeImageWithVision(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);

  const formData = new FormData();
  formData.append("file", imageBuffer);

  const payload = {
    inputs: {
      image: imageBuffer.toString("base64"),
      candidate_labels: CATEGORIES.map((c) => CATEGORY_PROMPTS[c]),
    },
  };

  let response;

  try {
    response = await axios.post(HF_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 20000,
    });
  } catch (err) {
    console.error("HF IMAGE API ERROR:", err.response?.data || err.message);
    throw new Error("IMAGE_AI_FAILED");
  }

  const results = response.data;

  // Find best category
  let best = {
    category: "other",
    confidence: 0.1,
  };

  results.forEach((item) => {
    const category = Object.keys(CATEGORY_PROMPTS).find(
      (key) => CATEGORY_PROMPTS[key] === item.label
    );

    if (category && item.score > best.confidence) {
      best = {
        category,
        confidence: item.score,
      };
    }
  });

  return {
    image_category: best.category,
    image_confidence: best.confidence,
    raw_predictions: results,
  };
}

module.exports = { analyzeImageWithVision };*/
/**
 * DEV MODE IMAGE AI BYPASS
 * --------------------------------
 * This bypasses Hugging Face due to
 * permission / quota restrictions.
 *
 * IMPORTANT:
 * - Image upload is still mandatory
 * - Output is deterministic
 * - Clearly marked DEV logic
 */

const analyzeImageWithVision = async (imagePath) => {
  if (!imagePath) {
    throw new Error("IMAGE_AI_FAILED");
  }

  // 🔥 DEV MODE MOCK OUTPUT
  return {
    image_category: "garbage_overflow", // safe default
    image_confidence: 0.8,              // strong confidence
    raw_predictions: [
      {
        label: "garbage_overflow",
        score: 0.8,
        source: "DEV_BYPASS",
      },
    ],
  };
};

module.exports = { analyzeImageWithVision };

