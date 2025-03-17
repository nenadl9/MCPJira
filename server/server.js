const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Enhanced questions database with different types
const questions = [
  {
    id: 1,
    type: "text",
    question: "What is the capital of France?",
    answer: "paris",
  },
  {
    id: 2,
    type: "multiple-choice",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    id: 3,
    type: "boolean",
    question: "Is the Earth flat?",
    answer: false,
  },
  {
    id: 4,
    type: "multiple-choice",
    question: "Which of these is not a programming language?",
    options: ["Python", "Java", "Banana", "Ruby"],
    answer: "Banana",
  },
  {
    id: 5,
    type: "text",
    question: "Who painted the Mona Lisa?",
    answer: "leonardo da vinci",
  },
  {
    id: 6,
    type: "multiple-choice",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: "Pacific",
  },
  {
    id: 7,
    type: "boolean",
    question: "Is water wet?",
    answer: true,
  },
  {
    id: 8,
    type: "text",
    question: "What is the chemical symbol for Gold?",
    answer: "au",
  },
  {
    id: 9,
    type: "multiple-choice",
    question: "Which of these animals is a mammal?",
    options: ["Snake", "Lizard", "Dolphin", "Turtle"],
    answer: "Dolphin",
  },
  {
    id: 10,
    type: "boolean",
    question: "Does the sun revolve around the Earth?",
    answer: false,
  },
];

let currentQuestion = null;

app.get("/api/question", (req, res) => {
  // Select a random question
  const randomIndex = Math.floor(Math.random() * questions.length);
  currentQuestion = questions[randomIndex];

  // Send question without answer
  res.json({
    id: currentQuestion.id,
    type: currentQuestion.type,
    question: currentQuestion.question,
    options: currentQuestion.options,
  });
});

app.post("/api/answer", (req, res) => {
  const { questionId, answer } = req.body;

  if (!currentQuestion || questionId !== currentQuestion.id) {
    return res.status(400).json({ error: "Invalid question ID" });
  }

  let isCorrect = false;
  if (currentQuestion.type === "text") {
    isCorrect =
      answer.toLowerCase().trim() === currentQuestion.answer.toLowerCase();
  } else if (currentQuestion.type === "multiple-choice") {
    isCorrect = answer === currentQuestion.answer;
  } else if (currentQuestion.type === "boolean") {
    isCorrect = answer === currentQuestion.answer;
  }

  res.json({
    correct: isCorrect,
    correctAnswer: currentQuestion.answer,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});