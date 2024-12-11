import React, { useContext, useState } from "react";
import { JournalContext } from '../JournalContext'; // Import JournalContext
import { useNavigate } from 'react-router-dom';
import './PageStyles.css';

const Moods = () => {
  const {addJournalEntry } = useContext(JournalContext); // Use JournalContext
  const [moodSubmissions, setMoodSubmissions] = useState(0);
  const maxMoodSubmissions = 3;
  const navigate = useNavigate();

  const handleMoodClick = (emotion) => {
    console.log('Mood clicked: ${emotion}');
    if (moodSubmissions < maxMoodSubmissions) {
        const moodEntry = {
            date: new Date().toISOString(), // Use ISO format with time
            type: "Mood",
            content: emotion,
            moodColor: getColorForMood(emotion), // Assign a color
          };

        // Add new mood entry
        addJournalEntry(moodEntry);

        setMoodSubmissions((prevCount) => prevCount + 1);
        alert(`Your mood (${emotion}) has been recorded!`);
        } else {
        alert("You have reached your mood submission limit for today.");
        }
    };

  const getColorForMood = (emotion) => {
    switch (emotion) {
      case "Happy":
        return "#FFD700"; // Gold
      case "Sad":
        return "#87CEEB"; // Light Blue
      case "Excited":
        return "#FF4500"; // Orange Red
      case "Neutral":
        return "#D3D3D3"; // Light Gray
      default:
        return "#FFFFFF"; // Default White
    }
  };

  return (
    <div className="page-container">
      <h2>How Are You Feeling Today?</h2>
      <div id="emotion-wheel">
        {[
          { emotion: "Happy", color: "#FFD700" },
          { emotion: "Sad", color: "#87CEEB" },
          { emotion: "Angry", color: "#FF4500" },
          { emotion: "Neutral", color: "#D3D3D3" },
          { emotion: "Fear", color: "#51414F" },
          { emotion: "Disgust", color: "#00A36C" },
          { emotion: "Surprised", color: "#FF00FF" },
        ].map(({ emotion, color }) => (
          <button
            key={emotion}
            className="emotion-btn"
            style={{ backgroundColor: color }}
            onClick={() => handleMoodClick(emotion)}
          >
            {emotion}
          </button>
        ))}
      </div>
      <p style={{ marginTop: "10px" }}>
        {moodSubmissions >= maxMoodSubmissions && "Daily submission limit reached."}
      </p>
      <button
        className="back-to-journaling-btn" // Custom class for placement
        onClick={() => navigate('/journaling')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Moods;