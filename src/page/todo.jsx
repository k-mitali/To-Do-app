import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Todo() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");
  const navigate = useNavigate();

  const authHeader = () => ({ authorization: localStorage.getItem("token") });

  const handleExpiry = useCallback((err) => {
  if (err?.response?.status === 401 || err?.response?.status === 403) {
    alert("Session expired. Please login again.");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login", { replace: true });
  }
}, [navigate]);

const getTasks = useCallback(async () => {
  try {
    const res = await axios.get("http://localhost:3001/tasks", { headers: authHeader() });
    setTasks(res.data);
  } catch (err) { handleExpiry(err); }
}, [handleExpiry]);

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) { navigate("/login"); return; }
  getTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login", { replace: true });
  };

  const addTask = async () => {
    if (!input.trim()) return;
    try {
      await axios.post("http://localhost:3001/tasks",
        { task: input, description: "do this task", deadline, priority, is_active: 1 },
        { headers: authHeader() }
      );
      setInput(""); setDeadline(""); setPriority("Low");
      getTasks();
    } catch (err) { handleExpiry(err); }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`, { headers: authHeader() });
      getTasks();
    } catch (err) { handleExpiry(err); }
  };

  const editTask = async (id) => {
    const newText = prompt("Edit your task");
    if (!newText) return;
    try {
      await axios.put(`http://localhost:3001/tasks/${id}`, { task: newText }, { headers: authHeader() });
      getTasks();
    } catch (err) { handleExpiry(err); }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:3001/tasks/${id}`, { is_active: currentStatus === 1 ? 0 : 1 }, { headers: authHeader() });
      getTasks();
    } catch (err) { handleExpiry(err); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📝 My Tasks</h1>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>

        <div style={styles.inputRow}>
          <input style={styles.input} value={input} onChange={(e) => setInput(e.target.value)} placeholder="New task..." />
          <select style={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
          <input style={styles.input} type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <button style={styles.addBtn} onClick={addTask}>Add</button>
        </div>

        <div>
          {tasks.map((task) => (
            <div key={task.task_id} style={styles.taskCard}>
              <input type="checkbox" checked={task.is_active === 0} onChange={() => toggleTask(task.task_id, task.is_active)} />
              <span style={{ ...styles.taskText, textDecoration: task.is_active === 0 ? "line-through" : "none", color: task.is_active === 0 ? "#aaa" : "#333" }}>
                {task.task}
              </span>
              <span style={{ ...styles.badge, background: task.priority === "High" ? "#ff4d4d" : task.priority === "Medium" ? "#ffa500" : "#4caf50" }}>
                {task.priority}
              </span>
              {task.deadline && <span style={styles.deadline}>📅 {task.deadline?.slice(0,10)}</span>}
              <button style={styles.editBtn} onClick={() => editTask(task.task_id)}>✏️</button>
              <button style={styles.deleteBtn} onClick={() => deleteTask(task.task_id)}>🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight:"100vh", background:"linear-gradient(135deg,#667eea,#764ba2)", padding:"2rem" },
  container: { maxWidth:"700px", margin:"0 auto", background:"#fff", borderRadius:"16px", padding:"2rem", boxShadow:"0 8px 32px rgba(0,0,0,0.2)" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" },
  title: { color:"#764ba2", margin:0 },
  logoutBtn: { padding:"0.5rem 1rem", background:"#ff4d4d", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer" },
  inputRow: { display:"flex", gap:"0.5rem", marginBottom:"1.5rem", flexWrap:"wrap" },
  input: { flex:1, padding:"0.6rem", borderRadius:"8px", border:"1px solid #ddd", fontSize:"0.95rem" },
  select: { padding:"0.6rem", borderRadius:"8px", border:"1px solid #ddd" },
  addBtn: { padding:"0.6rem 1.2rem", background:"linear-gradient(135deg,#667eea,#764ba2)", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer" },
  taskCard: { display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.75rem 1rem", borderRadius:"10px", background:"#f9f9f9", marginBottom:"0.5rem", flexWrap:"wrap" },
  taskText: { flex:1, fontSize:"0.95rem" },
  badge: { color:"#fff", padding:"0.2rem 0.6rem", borderRadius:"12px", fontSize:"0.75rem" },
  deadline: { fontSize:"0.8rem", color:"#888" },
  editBtn: { background:"none", border:"none", cursor:"pointer", fontSize:"1rem" },
  deleteBtn: { background:"none", border:"none", cursor:"pointer", fontSize:"1rem" },
};

export default Todo;