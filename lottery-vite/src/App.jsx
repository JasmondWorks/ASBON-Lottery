import { useState, useEffect } from "react";
import SessionForm from "./SessionForm";
import Lottery from "./Lottery";
import "./App.css";

function App() {
  const [session, setSession] = useState(() => {
    const savedSession = localStorage.getItem("session");
    return savedSession ? JSON.parse(savedSession) : null;
  });

  useEffect(() => {
    if (session) {
      document.title = `${session.title} | ${session.organizationName}`;
      const favicon =
        document.querySelector('link[rel="shortcut icon"]') ||
        document.querySelector('link[rel="icon"]');
      if (favicon && session.logo) {
        favicon.href = session.logo;
      }
      document.documentElement.style.setProperty(
        "--theme-color",
        session.theme
      );
    }
  }, [session]);

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
