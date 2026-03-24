import { useEffect, useState } from "react";
import "./App.css"; 
import axios from 'axios';


function App() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
      const response = await axios.get("http://localhost:3001/tasks");
      
      setTasks(response.data)
    }
  //component did mount
  useEffect(() => {
    // it will run on first time and single time
    getTasks()
     
  }, []) 


  // Add Task
  const addTask = async () => {
    if (input.trim() === "") return;

    const newTask = {
      todo: input,
      user_id: 1,
      description : "do this task",
      deadline : "2026-03-03",
      priority: "low",
      created_at: new Date(),
    };

    // setTasks([...tasks, newTask]);
    setInput("");
    // const postTask = async () => {
    const response =   await axios.post("http://localhost:3001/tasks", newTask)
    getTasks()
    console.log('Updated data',response.data) } 
  // }; 
  // postTask();
//   const deleteTask = async() =>{ 
//     const response = await axios.delete("http://localhost:3001/tasks/${task_id}")
// getTasks()
//   }

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
  const deleteTask = (deleteIndex) => {
  const newTasks = tasks.filter((task, index) => index !== deleteIndex);
  setTasks(newTasks);
}; 
const editTask = (editIndex) => {
  const newText = prompt("Edit your task");

  if (newText === null || newText.trim() === "") return;

  const newTasks = tasks.map((task, index) => {
    if (index === editIndex) {
      return {
        ...task,
        text: newText,
        updatedAt: new Date()
      };
    }
    return task;
  });

  setTasks(newTasks);
};
  // Counters
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
      console.log(tasks)

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
      </span> 
      <div> 
        checked={task.is_active === 1}
        {task.task} {new Date(task.created_at).toLocaleString()}
         {task.updatedAt && (
          <small>
            Updated: {task.updated_at.toLocaleString()}
            </small>
          )}
      </div>

      <button onClick={() => editTask(index)}>Edit</button>
      <button onClick={() => deleteTask(index)}>Delete</button>

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