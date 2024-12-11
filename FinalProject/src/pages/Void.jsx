import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageStyles.css';

const Void = () => {
  const navigate = useNavigate();
  const [voidText, setVoidText] = useState("");
  const [swirlingTexts, setSwirlingTexts] = useState([]);

  const handleSendToVoid = () => {
    const newMessage = { text: voidText, id: Date.now() };
    setSwirlingTexts((prev) => [...prev, newMessage]);
    setVoidText("");

    // Remove the message after 3 seconds
    setTimeout(() => {
        setSwirlingTexts((prev) => prev.filter((msg) => msg.id !== newMessage.id));
      }, 3000);
    };

  return (
<div className="page-container">
    <div className="black-hole-container">
        <div className="accretion-disk"></div>
        <div className="black-hole-text">Send your thoughts to the void...</div>
    </div>
    <div className="swirling-text">
          {swirlingTexts.map((msg) => (
            <p key={msg.id}>{msg.text}</p>
          ))}
        </div>
      <textarea
        value={voidText}
        onChange={(e) => setVoidText(e.target.value)}
        placeholder="Write something to send to the void..."
        className="journal-textarea"
      ></textarea>
      <button onClick={handleSendToVoid} className="add-task-btn">
        Send to the Void
      </button>
      <button
        className="back-to-journaling-btn" // Custom class for placement
        onClick={() => navigate('/journaling')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Void;