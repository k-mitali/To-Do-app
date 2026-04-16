import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Todo() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const getTasks = async () => {
    const response = await axios.get("http://localhost:3001/tasks", {
      headers: { authorization: localStorage.getItem("token") },
    });
    setTasks(response.data);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { alert("Please login first"); navigate("/"); return; }
        await getTasks();
      } catch (err) {
        console.log(err);
        alert("Error fetching tasks");
      }
    };
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login", { replace: true });
  };

  const addTask = async () => {
    if (!input.trim()) return;
    await axios.post("http://localhost:3001/tasks",
      { task: input, user_id: userId, description: "do this task", deadline, priority, is_active: 1 },
      { headers: { authorization: localStorage.getItem("token") } }
    );
    setInput(""); setDeadline(""); setPriority("Low");
    getTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:3001/tasks/${id}`, {
      headers: { authorization: localStorage.getItem("token") },
    });
    getTasks();
  };

  const editTask = async (id) => {
    const newText = prompt("Edit your task");
    if (!newText) return;
    await axios.put(`http://localhost:3001/tasks/${id}`, { task: newText }, {
      headers: { authorization: localStorage.getItem("token") },
    });
    getTasks();
  };

  const toggleTask = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    await axios.put(`http://localhost:3001/tasks/${id}`, { is_active: newStatus }, {
      headers: { authorization: localStorage.getItem("token") },
    });
    getTasks();
  };

  return (
    <div>
      <h1>Todo</h1>
      <p>User ID: {userId}</p>
      <button onClick={handleLogout}>Logout</button>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add task" />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option>Low</option><option>Medium</option><option>High</option>
      </select>
      <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      <button onClick={addTask}>Add</button>
      <div>
        {tasks.map((task) => (
          <div key={task.task_id}>
            <input type="checkbox" checked={task.is_active === 0} onChange={() => toggleTask(task.task_id, task.is_active)} />
            <span>{task.task}</span>
            <button onClick={() => editTask(task.task_id)}>Edit</button>
            <button onClick={() => deleteTask(task.task_id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todo;