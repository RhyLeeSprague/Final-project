import React, { createContext, useState } from "react";

export const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
    const [journalEntries, setJournalEntries] = useState([]); // Shared state for journal entries
    const [moods, setMoods] = useState({}); // Shared state for moods  

  const addJournalEntry = (entry) => {
    setJournalEntries((prevEntries) => [...prevEntries, entry]);
  };

  const updateMood = (date, mood) => {
    setMoods((prevMoods) => ({ ...prevMoods, [date]: mood }));
  };


  return (
    <JournalContext.Provider
      value={{
        journalEntries,
        setJournalEntries,
        addJournalEntry,
        moods,
        updateMood,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};
