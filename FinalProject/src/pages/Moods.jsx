import React, { useState } from "react";
import './PageStyles.css';

const Moods = () => {
    const [moodSubmissions, setMoodSubmissions] = useState(0);
    const maxMoodSubmissions = 3;

    const handleMoodClick = (emotion) => {
        if (moodSubmissions < maxMoodSubmissions) {
          alert(`Your mood (${emotion}) has been recorded!`);
          setMoodSubmissions((prevCount) => prevCount + 1);
        } else {
          alert("You have reached your mood submission limit for today.");
        }
      };    

  return (
    <div className="page-container">
<h2>How Are You Feeling Today?</h2>
      <div id="emotion-wheel">
        {[
          { emotion: "Happy", color: "#FFD700" },
          { emotion: "Sad", color: "#87CEEB" },
          { emotion: "Excited", color: "#FF4500" },
          { emotion: "Neutral", color: "#D3D3D3" },
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
      <p style={{ color: "red", marginTop: "10px" }}>
        {moodSubmissions >= maxMoodSubmissions && "Daily submission limit reached."}
      </p>
    </div>
  );
};

export default Moods;