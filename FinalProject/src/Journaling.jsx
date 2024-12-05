// File: Journaling.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import './Journaling.css';
import JournalEntry from './pages/JournalEntry';
import EntryTracker from './pages/EntryTracker';
import Moods from './pages/Moods';
import TaskTracker from './pages/TaskTracker';
import Void from './pages/Void';

const Journaling = () => {
    const navigate = useNavigate();

    /* const goToJournalEntry = () => {
        navigate("/journal-entry");
    }; */

    // Card data (with titles and navigation targets)
  const cards = [
    { id: '/journal-entry', icon: '📓', title: 'Daily Journal Entry' },
    { id: '/task-tracker', icon: '🪵', title: 'Log/Organize Daily Tasks' },
    { id: '/moods', icon: '🙂', title: 'Log a Daily Feeling' },
    { id: '/entry-tracker', icon: '📆', title: 'Track Your Daily Feelings and Journals' },
    { id: '/void', icon: '🕳', title: 'The void' },
  ];

  // Handler for navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="background">
      {/* Header Section */}
      <div className="header">
        <h1>Mindful Journaling</h1>
      </div>

            {/* Cards Section */}
            <div className="card-container">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card"
            onClick={() => handleNavigation(card.id)}
          >
            <i>{card.icon}</i>
            <p>{card.title}</p>
          </div>
        ))}
      </div>

      {/* Quote Section */}
      <div className="quote-section">
        <p>
        "Journal what you love, what you hate, what's in your head, what's important. 
        Journaling organizes your thoughts; allows you to see things in a concrete way that otherwise you might not see. 
        Focus on what you think you need to find in your art."
        </p>
        <p className="author">- Kay WalkingStick</p>
      </div>
    </div> 
  );
};

export default Journaling;