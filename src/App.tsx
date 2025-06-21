import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";

// Types
type MCQ = {
  id: string;
  question: string;
  choices: string[];
};

type CheckAnswerRequest = {
  id: string;
  answer: string;
};

type CheckAnswerResponse = {
  correct: boolean;
  correct_answer: string;
};

// API functions
const generateMCQ = async (): Promise<MCQ> => {
  const res = await fetch("http://localhost:8000/generate-mcq", {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to fetch MCQ");
  return res.json();
};

const checkAnswer = async (
  data: CheckAnswerRequest
): Promise<CheckAnswerResponse> => {
  const res = await fetch("http://localhost:8000/check-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to check answer");
  return res.json();
};

// Main App
const App: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [mcq, setMcq] = useState<MCQ | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<CheckAnswerResponse | null>(
    null
  );

  const generateMcqMutation = useMutation({ mutationFn: generateMCQ });
  const checkAnswerMutation = useMutation({ mutationFn: checkAnswer });

  const startGame = async () => {
    setStarted(true);
    setAnswerResult(null);
    setSelected(null);
    const data = await generateMcqMutation.mutateAsync();
    setMcq(data);
  };

  const handleSelect = (choice: string) => {
    setSelected(choice);
  };

  const handleSubmit = async () => {
    if (!mcq || !selected) return;
    const result = await checkAnswerMutation.mutateAsync({
      id: mcq.id,
      answer: selected,
    });
    setAnswerResult(result);
  };

  const handleNext = async () => {
    setAnswerResult(null);
    setSelected(null);
    const data = await generateMcqMutation.mutateAsync();
    setMcq(data);
  };

  if (!started) {
    return (
      <div style={{ padding: 24 }}>
        <h2>MCQ Game</h2>
        <button onClick={startGame}>Start Game</button>
      </div>
    );
  }

  if (generateMcqMutation.isPending) {
    return <div style={{ padding: 24 }}>Loading question...</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2>MCQ Game</h2>
      {mcq && (
        <div>
          <div>
            <strong>Q:</strong> {mcq.question}
          </div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {mcq.choices.map((choice) => (
              <li key={choice} style={{ margin: "8px 0" }}>
                <label>
                  <input
                    type="radio"
                    name="choice"
                    value={choice}
                    checked={selected === choice}
                    disabled={!!answerResult}
                    onChange={() => handleSelect(choice)}
                  />{" "}
                  {choice}
                </label>
              </li>
            ))}
          </ul>
          {!answerResult && (
            <button
              onClick={handleSubmit}
              disabled={!selected || checkAnswerMutation.isPending}
            >
              Submit
            </button>
          )}
          {answerResult && (
            <div style={{ marginTop: 16 }}>
              {answerResult.correct ? (
                <span style={{ color: "green" }}>Correct!</span>
              ) : (
                <span style={{ color: "red" }}>
                  Incorrect. Correct answer: {answerResult.correct_answer}
                </span>
              )}
              <div style={{ marginTop: 12 }}>
                <button onClick={handleNext}>Next Question</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
