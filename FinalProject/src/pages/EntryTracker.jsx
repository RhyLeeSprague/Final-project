import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid"; // Import day grid plugin
import Chart from "chart.js/auto"; // Import Chart.js
import './PageStyles.css';
import { JournalContext } from "../JournalContext";

const EntryTracker = () => {
    const [chart, setChart] = useState(null);

  // Example entries (replace with dynamic data if needed)
  const entries = [
    { date: "2024-12-01", mood: "Happy", journal: "I had a great day!" },
    { date: "2024-12-02", mood: "Sad", journal: "Feeling down today." },
    { date: "2024-12-03", mood: "Excited", journal: "Looking forward to tomorrow!" },
  ];

  const moodColors = {
    Happy: "#FFD700",
    Sad: "#87CEEB",
    Excited: "#FF4500",
    Neutral: "#D3D3D3",
  };

  // Combine and format data from journal and mood entries
  const events = [
    ...journalEntries.map((entry) => ({
      title: `Journal: ${entry.text}`,
      start: entry.date,
      backgroundColor: moodColors[entry.mood] || moodColors.Neutral,
    })),
    ...moodEntries.map((entry) => ({
      title: `Mood: ${entry.mood}`,
      start: entry.date,
      backgroundColor: moodColors[entry.mood] || moodColors.Neutral,
    })),
  ];

  useEffect(() => {
    // Generate a bar chart for mood overview
    const ctx = document.getElementById("emotion-graph").getContext("2d");
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    const chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(moodCounts),
        datasets: [
          {
            label: "Mood Count",
            data: Object.values(moodCounts),
            backgroundColor: Object.keys(moodCounts).map((mood) => moodColors[mood]),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    setChart(chartInstance);

    return () => {
      if (chartInstance) chartInstance.destroy(); // Clean up chart instance
    };
  }, [moodEntries]);


  return (
    <div className="page-container">
    <h2>Entry Tracker</h2>
      <div id="calendar">
        <FullCalendar
          plugins={[dayGridPlugin]} // Use day grid plugin
          initialView="dayGridMonth"
          events={events} // Add dynamic events
        />
      </div>
      <h3>Emotion Overview</h3>
      <canvas id="emotion-graph" width="400" height="200"></canvas>
    </div>
  );
};

export default EntryTracker;