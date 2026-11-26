
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20kb" }));

// NOVA AI home connection
app.get("/", (req, res) => {
  res.send("NOVA AI server is running!");
});

// NOVA AI chat
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: "NOVA AI is waiting for its AI connection."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-6-luna",
          instructions:
            "You are NOVA AI, a friendly, intelligent and helpful AI assistant. Help users clearly and respectfully.",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("AI provider error:", data);
      return res.status(502).json({
        error: "NOVA AI could not respond. Please try again."
      });
    }

    const reply = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    res.json({
      reply: reply || "Please try sending your message again."
    });

  } catch (error) {
    console.error("NOVA AI error:", error);

    res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("NOVA AI server is running!");
});
  
      
