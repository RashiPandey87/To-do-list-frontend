import { Link } from "react-router-dom";

function App() {
  return (
    <div>
      <h1>To-Do App</h1>
      <nav>
        <Link to="/register">Register</Link> | 
        <Link to="/login">Login</Link> | 
        <Link to="/dashboard">Dashboard</Link>
      </nav>
    </div>
  );
}

export default App;
