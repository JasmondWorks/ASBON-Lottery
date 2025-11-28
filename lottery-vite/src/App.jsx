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
    const lsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="#87c127"/><text x="16" y="22" font-size="16" font-family="Arial" text-anchor="middle" fill="white">LS</text></svg>`;
    const lsDataUrl = `data:image/svg+xml;base64,${btoa(lsSvg)}`;

    let faviconLink = document.querySelector("link[data-dynamic-favicon]");
    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      faviconLink.setAttribute("data-dynamic-favicon", "true");
      document.head.appendChild(faviconLink);
    }

    if (session) {
      document.title = `${session.title} | ${session.organizationName}`;
      faviconLink.href = session.logo || lsDataUrl;
      document.documentElement.style.setProperty(
        "--theme-color",
        session.theme
      );
    } else {
      document.title = "Lottery Spinner";
      faviconLink.href = lsDataUrl;
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
