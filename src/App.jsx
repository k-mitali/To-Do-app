import { useState } from "react";
import "./App.css"; 

function App() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);

  // Add Task
  const addTask = () => {
    if (input.trim() === "") return;

    const newTask = {
      text: input,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInput("");
  };

  // Toggle Task
  const toggleTask = (clickedIndex) => {
    const newTasks = tasks.map((task, index) => {
      if (index === clickedIndex) {
        return {
          ...task,
          completed: !task.completed,
        };
      } else {
        return task;
      }
    });

    setTasks(newTasks);
  };

  // Counters
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  return (
  <div className="app">
    <div className="todo-box">
      
      <h1 className="title">TO-DO</h1>

      {/* Input Box */}
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add new task"
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Task List Box */}
      <div className="task-box">
        {tasks.map((task, index) => (
          <div key={index} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(index)}
            />
            <span className={task.completed ? "completed" : ""}>
              {task.text}
            </span>
          </div>
        ))}
      </div>

      {/* Summary Box */}
      <div className="summary-box">
        <div>Total: {totalTasks}</div>
        <div>Pending: {pendingTasks}</div>
        <div>Completed: {completedTasks}</div>
      </div>

    </div>
  </div>
);
}

export default App;