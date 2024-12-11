import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import { JournalContext } from '../JournalContext'; // Import context
import './PageStyles.css';

const moodColors = {
  happy: 'yellow',
  sad: 'blue',
  excited: 'red',
  neutral: 'gray',
}; // Define mood colors

const EntryTracker = () => {
  const { journalEntries, setJournalEntries } = useContext(JournalContext); // Access the shared entries
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const navigate = useNavigate();

  // Load journal entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        if (Array.isArray(parsedEntries)) {
          setJournalEntries(parsedEntries); // Set journal entries from localStorage
        }
      } catch (e) {
        console.error("Failed to parse journalEntries from localStorage:", e);
      }
    }
  }, [setJournalEntries]);

  // Save journal entries to localStorage on update
  useEffect(() => {
    if (journalEntries) {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    }
  }, [journalEntries]);

  // Filter journal entries for the selected date
  const filteredEntries = journalEntries.filter((entry) => {
    const entryDate = new Date(entry.date).toDateString();
    const selectedDateString = selectedDate.toDateString();
    return entryDate === selectedDateString;
  });

  const aggregatedMood = filteredEntries
    .filter((entry) => entry.type === 'Mood') // Only mood entries
    .map((entry) => entry.content) // Extract the mood
    .join(', '); // Combine into a single string (e.g, "Happy, Sad")

  // Group journal entries by date and map moods to colors
  const entriesByDate = journalEntries
    .filter((entry) => entry && entry.date) // Ensure entry and date are valid
    .reduce((acc, entry) => {
      const date = new Date(entry.date).toDateString();
      if (!acc[date]) acc[date] = [];
      if (entry.type === "Mood" && entry.content) acc[date].push(entry.content); // Only include moods
      return acc;
    }, {});

  // Assign a mood color for each date
  const getTileClassName = ({ date }) => {
    const dateString = date.toDateString();
    const moods = entriesByDate[dateString];
    if (moods && moods.length > 0) {
      const dominantMood = moods[0]; // Pick the first mood (or calculate the most common)
      return `mood-${dominantMood}`;
    }
    return ''; // No class if no entries
  };

  return (
    <div className="page-container">
      <h1>Entry Tracker</h1>
      <div className="calendar-container">
        <Calendar
          onChange={setSelectedDate} // Update selected date
          value={selectedDate} // Current selected date
          tileClassName={getTileClassName} // Add class for mood coloring
        />
      </div>
      <h2>Entries for {selectedDate.toDateString()}</h2>
      <table className="tracker-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Prompt</th>
            <th>Entry</th>
            <th>Mood</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.length > 0 ? (
            filteredEntries.filter((entry) => entry.type !== 'Mood') // Exclude mood-only rows
            .map((entry, index) => (
              <tr key={index}>
                <td>{entry.date ? new Date(entry.date).toLocaleTimeString() : "N/A"}</td>
                <td>{entry.prompt || "N/A"}</td>
                <td>{entry.text || entry.content || "N/A"}</td>
                <td>{aggregatedMood || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No entries for this date</td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        className="back-to-journaling-btn" // Custom class for placement
        onClick={() => navigate('/journaling')}
      >
        Back to Home
      </button>

    </div>
  );
};

export default EntryTracker;