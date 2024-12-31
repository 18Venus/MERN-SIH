import React, { useState, useEffect } from "react";
import "./journal.css";
import { MdDeleteForever } from "react-icons/md";

function Journal({ selectedDate, closeWindow }) {
  const [currentEntry, setCurrentEntry] = useState("");
  const [previousEntries, setPreviousEntries] = useState([]);
  const [viewingEntry, setViewingEntry] = useState(null);

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem("journalEntries")) || {};
    const dateEntries = Array.isArray(savedEntries[selectedDate]) 
      ? savedEntries[selectedDate] 
      : [];
    setPreviousEntries(dateEntries);
  }, [selectedDate]);

  const handleSave = () => {
    if (!currentEntry.trim()) return;

    const savedEntries = JSON.parse(localStorage.getItem("journalEntries")) || {};
    const dateEntries = Array.isArray(savedEntries[selectedDate]) 
      ? savedEntries[selectedDate] 
      : [];

    const updatedDateEntries = [...dateEntries, currentEntry];
    savedEntries[selectedDate] = updatedDateEntries;

    localStorage.setItem("journalEntries", JSON.stringify(savedEntries));
    setPreviousEntries(updatedDateEntries);
    setCurrentEntry("");
    alert("Journal entry saved!");
  };

  const handleViewEntry = (entry) => {
    setViewingEntry(entry);
  };

  const closeViewingEntry = () => {
    setViewingEntry(null);
  };

  const handleDeleteEntry = (entry) => {
    const savedEntries = JSON.parse(localStorage.getItem("journalEntries")) || {};
    const dateEntries = Array.isArray(savedEntries[selectedDate]) 
      ? savedEntries[selectedDate] 
      : [];

    const updatedDateEntries = dateEntries.filter((e) => e !== entry);
    savedEntries[selectedDate] = updatedDateEntries;

    localStorage.setItem("journalEntries", JSON.stringify(savedEntries));
    setPreviousEntries(updatedDateEntries);
    alert("Entry deleted.");
  };

  return (
    <div className="journal-window">
      <h3>Journal Entry for {selectedDate}</h3>

      {!viewingEntry ? (
        <>
          <textarea
            placeholder="Write your journal entry here..."
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            className="journal-textarea"
          />
          <button onClick={handleSave} className="save-btn">
            Save Entry
          </button>
        </>
      ) : (
        <div className="view-entry">
          <h4>Viewing Full Entry:</h4>
          <p>{viewingEntry}</p>
          <button onClick={closeViewingEntry} className="back-btn">
            Back to Writing
          </button>
        </div>
      )}

      {!viewingEntry && (
        <div className="previous-entries">
          <h4>Previous Entries for {selectedDate}</h4>
          {previousEntries.length > 0 ? (
            <ul>
              {previousEntries.map((entry, index) => (
                <li key={index} className="entry-item">
                  <span>{entry.length > 20 ? `${entry.slice(0, 20)}...` : entry}</span>
                  <div className="entry-actions">
                    <button onClick={() => handleViewEntry(entry)} className="view-btn">
                      View Full
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry)}
                      className="delete-btn"
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No previous entries for this date.</p>
          )}
        </div>
      )}

      {!viewingEntry && (
        <button onClick={closeWindow} className="close-btn">
          Close
        </button>
      )}
    </div>
  );
}

export default Journal;