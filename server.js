const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("NOVA AI server is running!");
});

app.post("/chat", (req, res) => {
  const message = req.body.message;

  res.json({
    reply: "Welcome to NOVA AI! You said: " + message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("NOVA AI server is running!");
});
