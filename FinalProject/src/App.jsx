import { useState, useEffect } from 'react'
import './App.css'
import React from 'react';
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Page Components
import Login from './Login';
import Journaling from "./Journaling";
import JournalEntry from "./pages/JournalEntry";
import TaskTracker from "./pages/TaskTracker";
import Moods from "./pages/Moods";
import EntryTracker from "./pages/EntryTracker";
import Void from "./pages/Void";

// Import JournalProvider
import { JournalProvider } from "./JournalContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleAuthentication = (status) => {
    setIsAuthenticated(status);
  };

  useEffect(() => {
    const guestMode = localStorage.getItem('guestMode');
    const authToken = localStorage.getItem('authToken');
    if (authToken || guestMode === 'true') {
      setIsAuthenticated(true); // Authenticate if a token or guest mode exists
    }
    setLoading(false); // Stop loading once the check is complete
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optional: Add a loading spinner or placeholder
  }

  return (
    <JournalProvider>
      <Router>
        {!isAuthenticated ? (
          <Login onAuthenticate={handleAuthentication} />
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/journaling" />} />
            <Route path="/journaling" element={<Journaling />} />
            <Route path="/journal-entry" element={<JournalEntry />} />
            <Route path="/task-tracker" element={<TaskTracker />} />
            <Route path="/moods" element={<Moods />} />
            <Route path="/entry-tracker" element={<EntryTracker />} />
            <Route path="/void" element={<Void />} />
          </Routes>
        )}
      </Router>
    </JournalProvider>
  );
}

export default App


/*     <div>
<a href="https://vitejs.dev" target="_blank">
<img src={"https://journeytojoy.tv/WordPress/wp-content/uploads/2023/10/Emotion-XP_Moods_FeelingsWheel_XP3MS.jpg"} className="logo" alt="Vite logo" />
</a>
</div>
*/