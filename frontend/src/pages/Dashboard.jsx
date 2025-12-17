import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingTask, setEditingTask] = useState(null); // new state
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Add task
  const addTask = async () => {
    setError("");
    if (!title) return setError("Task title cannot be empty");
    try {
      await axios.post("/tasks", { title });
      setTitle("");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task");
    }
  };

  // Toggle status
  const toggle = async (task) => {
    await axios.put(`/tasks/${task._id}`, {
      status: task.status === "Pending" ? "Completed" : "Pending",
    });
    fetchTasks();
  };

  // Delete task
  const remove = async (id) => {
    await axios.delete(`/tasks/${id}`);
    fetchTasks();
  };

  // Start editing task
  const startEdit = (task) => {
    setEditingTask(task);
  };

  // Submit edited task
  const submitEdit = async () => {
    if (!editingTask.title) return setError("Task title cannot be empty");
    try {
      await axios.put(`/tasks/${editingTask._id}`, {
        title: editingTask.title,
        status: editingTask.status,
      });
      setEditingTask(null);
      setError("");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>My Tasks</h2>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="task-input">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t._id} className={t.status === "Completed" ? "completed" : ""}>
            {editingTask && editingTask._id === t._id ? (
              <>
                <input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
                <select
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
                <button onClick={submitEdit}>Save</button>
                <button onClick={() => setEditingTask(null)}>Cancel</button>
              </>
            ) : (
              <>
                {t.title} - {t.status}
                <button onClick={() => toggle(t)}>Toggle</button>
                <button onClick={() => startEdit(t)}>Edit</button>
                <button onClick={() => remove(t._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
