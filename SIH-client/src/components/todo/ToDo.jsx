import React, { useState, useEffect } from 'react';
import "./todo.css";
import { MdCheck, MdDeleteForever } from "react-icons/md";

function ToDo({ selectedDate, closeWindow }) {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem(selectedDate)) || [];
    setTasks(savedTasks);
  }, [selectedDate]);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!inputValue) return;

    const newTask = { text: inputValue, completed: false };
    const updatedTasks = [...tasks, newTask];

    setTasks(updatedTasks);
    setInputValue("");

    localStorage.setItem(selectedDate, JSON.stringify(updatedTasks));
  };

  const handleTaskToggle = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );

    setTasks(updatedTasks);

    localStorage.setItem(selectedDate, JSON.stringify(updatedTasks));
  };

  const handleTaskDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);

    setTasks(updatedTasks);

    localStorage.setItem(selectedDate, JSON.stringify(updatedTasks));
  };

  return (
    <div className="todo-window">
      <h3>To-Do for {selectedDate}</h3>

      <section className="form">
        <form onSubmit={handleFormSubmit}>
          <div>
            <input
              type="text"
              className="todo-input"
              autoComplete="off"
              value={inputValue}
              onChange={(event) => handleInputChange(event.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="todo-btn">
              Add Task
            </button>
          </div>
        </form>
      </section>

      <section className="myUnOrdList">
        <ul>
          {tasks.map((curTask, index) => (
            <li
              key={index}
              className={`todo-item ${curTask.completed ? "completed" : ""}`}
            >
              <span>{curTask.text}</span>
              <button
                className="check-btn"
                onClick={() => handleTaskToggle(index)}
              >
                <MdCheck />
              </button>
              <button
                className="delete-btn"
                onClick={() => handleTaskDelete(index)}
              >
                <MdDeleteForever />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <button onClick={closeWindow} className="close-btn">
        Close
      </button>
    </div>
  );
}

export default ToDo;