import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/login";
import Todo from "./page/todo";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todo" element={<Todo />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;