import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

interface Question {
  id: number;
  type: "text" | "multiple-choice" | "boolean";
  question: string;
  options?: string[];
  answer: string | boolean;
}

function App() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | boolean>("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, isTimerActive]);

  const handleTimeUp = () => {
    setFeedback("Time is up!");
    setIsTimerActive(false);
    setTimeout(fetchNewQuestion, 8000);
  };

  const fetchNewQuestion = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/question");
      setQuestion(response.data);
      setUserAnswer("");
      setFeedback("");
      setTimeLeft(30);
      setIsTimerActive(true);
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTimerActive(false);

    if (!question) return;

    console.log("Submitting answer:", {
      questionType: question.type,
      userAnswer,
      questionId: question.id,
    });

    try {
      const response = await axios.post("/api/answer", {
        questionId: question.id,
        answer: userAnswer,
      });

      console.log("Server response:", response.data);

      const { correct, correctAnswer } = response.data;
      if (correct) {
        setScore((prev) => prev + 1);
        setFeedback("Correct! 🎉");
      } else {
        setFeedback(`Wrong! The correct answer was: ${correctAnswer}`);
      }

      setTimeout(fetchNewQuestion, 8000);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const renderAnswerInput = () => {
    if (!question) return null;

    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="options-grid" data-testid="multiple-choice-options">
            {question.options?.map((option, index) => (
              <button
                key={index}
                type="button"
                className={`option-button ${
                  userAnswer === option ? "selected" : ""
                }`}
                onClick={() => {
                  console.log("Setting userAnswer to:", option);
                  setUserAnswer(option);
                }}
                disabled={!!feedback}
                data-testid={`option-${index}`}
                data-option-text={option}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case "boolean":
        return (
          <div className="options-grid" data-testid="boolean-options">
            <button
              type="button"
              className={`option-button ${
                userAnswer === true ? "selected" : ""
              }`}
              onClick={() => setUserAnswer(true)}
              disabled={!!feedback}
              data-testid="option-true"
            >
              True
            </button>
            <button
              type="button"
              className={`option-button ${
                userAnswer === false ? "selected" : ""
              }`}
              onClick={() => setUserAnswer(false)}
              disabled={!!feedback}
              data-testid="option-false"
            >
              False
            </button>
          </div>
        );
      default:
        return (
          <input
            type="text"
            value={userAnswer as string}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer..."
            disabled={!!feedback}
            data-testid="text-answer-input"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="App" data-testid="loading-state">
        Loading...
      </div>
    );
  }

  return (
    <div className="App" data-testid="quiz-app">
      <div className="quiz-container" data-testid="quiz-container">
        <div className="header" data-testid="quiz-header">
          <h1 data-testid="app-title">Quiz Game</h1>
          <div className="header-divider"></div>
          <div className="stats" data-testid="stats-container">
            <div className="score" data-testid="score-display">
              Score: {score}
            </div>
            <div
              className={`timer ${timeLeft <= 5 ? "warning" : ""}`}
              data-testid="timer-display"
            >
              Time: {timeLeft}s
            </div>
          </div>
        </div>

        <div className="question-card" data-testid="question-card">
          <h2 data-testid="question-text">{question?.question}</h2>
          <form onSubmit={handleSubmit} data-testid="answer-form">
            {renderAnswerInput()}
            <button
              type="submit"
              disabled={
                userAnswer === "" ||
                userAnswer === null ||
                userAnswer === undefined ||
                !!feedback
              }
              className="submit-button"
              data-testid="submit-button"
            >
              Submit Answer
            </button>
          </form>
          {feedback && (
            <div className="feedback" data-testid="feedback-message">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;