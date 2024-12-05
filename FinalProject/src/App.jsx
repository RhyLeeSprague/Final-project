import { useState } from 'react'
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Page Components
import Journaling from "./Journaling";
import JournalEntry from "./pages/JournalEntry";
import TaskTracker from "./pages/TaskTracker";
import Moods from "./pages/Moods";
import EntryTracker from "./pages/EntryTracker";
import Void from "./pages/Void";

// Import JournalProvider
import { JournalProvider } from "./JournalContext";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <JournalProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Journaling />} />
        <Route path="/journal-entry" element={<JournalEntry />} />
        <Route path="/task-tracker" element={<TaskTracker />} />
        <Route path="/moods" element={<Moods />} />
        <Route path="/entry-tracker" element={<EntryTracker />} />
        <Route path="/void" element={<Void />} />
      </Routes>
    </Router>
    </JournalProvider>
    </>
  )
}

export default App


/*     <div>
<a href="https://vitejs.dev" target="_blank">
<img src={"https://journeytojoy.tv/WordPress/wp-content/uploads/2023/10/Emotion-XP_Moods_FeelingsWheel_XP3MS.jpg"} className="logo" alt="Vite logo" />
</a>
</div>
*/