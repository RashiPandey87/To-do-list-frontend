import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editTaskId, setEditTaskId] = useState(null); // Track task being edited
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchTasks();
    }
  }, [token, navigate]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      alert("Error fetching tasks. Please log in again.");
      navigate("/login");
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/tasks`,
        { text: taskText, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, res.data]);
      setTaskText("");
      setDueDate("");
    } catch (err) {
      alert("Error adding task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      alert("Error deleting task.");
    }
  };

  const editTask = async (taskId) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/tasks/${taskId}`,
        { text: editText, dueDate: editDueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((task) => (task._id === taskId ? res.data : task)));
      setEditTaskId(null);
    } catch (err) {
      alert("Error updating task.");
    }
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>

      {/* Add Task Form */}
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="New Task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            {editTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  required
                />
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  required
                />
                <button onClick={() => editTask(task._id)}>Save</button>
              </>
            ) : (
              <>
                {task.text} - {new Date(task.dueDate).toLocaleDateString()}
                <button onClick={() => { setEditTaskId(task._id); setEditText(task.text); setEditDueDate(task.dueDate); }}>Edit</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
