import { useState } from "react";
import SessionForm from "./SessionForm";
import Lottery from "./Lottery";
import "./App.css";

function App() {
  const [session, setSession] = useState(() => {
    const savedSession = localStorage.getItem("session");
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const handleReset = () => {
    setSession(null);
    localStorage.removeItem("session");
    localStorage.removeItem("results");
  };

  return (
    <div style={{ height: "100%" }}>
      {session ? (
        <Lottery session={session} onReset={handleReset} />
      ) : (
        <SessionForm onSubmit={setSession} />
      )}
    </div>
  );
}

export default App;
