import { useState } from "react";
import axios from "../api/axios";
import "../styles/TaskForm.css";

export default function TaskForm({ fetchTasks }) {
  const [title, setTitle] = useState("");

  const addTask = async () => {
    if (!title.trim()) return; // prevent empty tasks
    await axios.post("/tasks", { title });
    setTitle("");
    fetchTasks();    
  };

  return (
    <div className="taskform-container">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter  the task title"
      />
      <button onClick={addTask}>Add</button>
    </div>
  );
}
