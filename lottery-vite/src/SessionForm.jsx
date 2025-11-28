import { useState } from "react";
import Lottery from "./Lottery";

function SessionForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [theme, setTheme] = useState("#87c127");
  const [organizationName, setOrganizationName] = useState("");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result);
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    const session = {
      title: title.trim(),
      participants: participants ? parseInt(participants) : 150,
      logo,
      theme,
      organizationName:
        organizationName.trim() ||
        "ASBON - Association of Small Business Owners Nigeria",
    };
    localStorage.setItem("session", JSON.stringify(session));
    onSubmit(session);
  };

  return (
    <div className="content-wrapper">
      <header className="header">
        <div className="container">
          <img src="/asbon.png" alt="asbon logo" />
        </div>
      </header>
      <div className="jack-box">
        <div className="container">
          <h1 className="title">Start New Lottery Session</h1>
          <form onSubmit={handleSubmit} className="session-form">
            <div className="form-group">
              <label>Title (required):</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Organization Name:</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g., ASBON - Association of Small Business Owners Nigeria"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Number of Participants (optional, default 150):</label>
              <input
                type="number"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                min="1"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Organization Logo (optional):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="form-input"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="logo-preview"
                />
              )}
            </div>
            <div className="form-group">
              <label>Theme Color:</label>
              <input
                type="color"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="form-input"
                style={{ height: "50px" }}
              />
            </div>
            <button type="submit" className="btn primary">
              Start Session
            </button>
          </form>
        </div>
      </div>
      <footer className="footer">
        <div>
          <p>ASBON - Association of Small Business Owners Nigeria</p>
        </div>
      </footer>
    </div>
  );
}

export default SessionForm;
