import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { JournalContext } from "../JournalContext";
import './PageStyles.css';

const JournalEntry = () => {
const { addJournalEntry } = useContext(JournalContext);
const navigate = useNavigate();

    // Predefined prompts
  const prompts = [
    "What made you smile today?",
    "Describe something challenging you overcame recently.",
    "What are three things you're grateful for?",
    "What is one good thing and one bad thing that happened today?",
    "Write about a step on your journey through today.",
  ];

  // States
  const [randomPrompt, setRandomPrompt] = useState("");
  const [journalInput, setJournalInput] = useState("");
  const [submissionsToday, setSubmissionsToday] = useState(0);
  const maxSubmissionsPerDay = 3;

  // Generate a random prompt on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setRandomPrompt(prompts[randomIndex]);
  }, []);

  // Handle journal entry submission
  const handleSubmit = () => {
    if (submissionsToday < maxSubmissionsPerDay) {
      const entry = {
        text: journalInput,
        date: new Date().toISOString(),
        prompt: randomPrompt,
      };
      addJournalEntry(entry); // Add entry to the shared context
      setSubmissionsToday((prevCount) => prevCount + 1);
      setJournalInput("");
      alert("Your entry has been saved!");
    } else {
      alert("You have reached the submission limit for today.");
    }
  };

  return (
    <div className="page-container">
      <h1>Daily Journal Entry</h1>
      <div id="random-prompt">
        <p id="prompt-text">{randomPrompt}</p>
      </div>
      <textarea
        id="journal-input"
        placeholder="Write your thoughts here..."
        value={journalInput}
        onChange={(e) => setJournalInput(e.target.value)}
      ></textarea>
      <button id="submit-journal" onClick={handleSubmit}>
        Save and Submit
      </button>
      {submissionsToday >= maxSubmissionsPerDay && (
        <p id="submission-limit-warning" style={{ color: "red" }}>
          You have reached the submission limit for today.
        </p>
      )}
      <button
        className="back-to-journaling-btn" // Custom class for placement
        onClick={() => navigate('/journaling')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default JournalEntry;