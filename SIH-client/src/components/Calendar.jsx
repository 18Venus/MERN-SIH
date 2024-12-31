import React, { useState } from "react";
import "./calendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ToDo from "./todo/ToDo";
import Journal from "./journal/Journal";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeOption, setActiveOption] = useState(null);
  const [isFutureDate, setIsFutureDate] = useState(false);

  const handleDateClick = (info) => {
    if (!activeOption) {
      const today = new Date();
      const clickedDate = new Date(info.dateStr);

      setSelectedDate(info.dateStr);
      setIsFutureDate(clickedDate > today);
    }
  };

  const handleOptionClick = (option) => {
    setActiveOption(option);
  };

  const closeWindow = () => {
    setSelectedDate(null);
    setActiveOption(null);
    setIsFutureDate(false);
  };

  return (
    <div>
      <FullCalendar
        height={650}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        dateClick={handleDateClick}
        dayCellClassNames={() => "clickable-date"}
      />

      {selectedDate && !activeOption && (
        <div className="modal">
          <div className="modal-content">
            <h3>Selected Date: {selectedDate}</h3>

            {isFutureDate ? (
              <button onClick={() => handleOptionClick("To-Do")}>To-Do</button>
            ) : (
              <>
                <button onClick={() => handleOptionClick("To-Do")}>To-Do</button>
                <button onClick={() => handleOptionClick("Journal")}>
                  Journal
                </button>
              </>
            )}

            <button onClick={closeWindow} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {activeOption === "To-Do" && (
        <ToDo selectedDate={selectedDate} closeWindow={closeWindow} />
      )}

      {activeOption === "Journal" && (
        <Journal selectedDate={selectedDate} closeWindow={closeWindow} />
      )}
    </div>
  );
}

export default Calendar;