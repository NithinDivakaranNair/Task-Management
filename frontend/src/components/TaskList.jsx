import axios from "../api/axios";
import "../styles/TaskList.css";

export default function TaskList({ tasks, fetchTasks }) {
  const toggle = async (task) => {
    await axios.put(`/tasks/${task._id}`, {
      status: task.status === "Pending" ? "Completed" : "Pending"
    });
    fetchTasks();
  };

  const remove = async (id) => {
    await axios.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <ul className="tasklist-ul">
      {tasks.map(task => (
        <li key={task._id} className="tasklist-li">
          <span>{task.title} - {task.status}</span>
          <div>
            <button className="toggle-btn" onClick={() => toggle(task)}>Toggle</button>
            <button className="delete-btn" onClick={() => remove(task._id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
