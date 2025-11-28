import { useState, useEffect } from "react";
import Lottery from "./Lottery";
import { FaEye } from "react-icons/fa";

function SessionForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [theme, setTheme] = useState("#87c127");
  const [organizationName, setOrganizationName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", theme);
  }, [theme]);

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
      organizationName: organizationName.trim(),
    };
    localStorage.setItem("session", JSON.stringify(session));
    onSubmit(session);
  };

  return (
    <div className="content-wrapper">
      <div className="jack-box">
        <div className="container">
          <h1 className="title">Start New Lottery Session</h1>
          <form onSubmit={handleSubmit} className="session-form">
            <div className="form-group">
              <label>
                Title{" "}
                <span
                  style={{
                    color: "red",
                    fontWeight: "800",
                    transform: "translateY(-2px)",
                  }}
                >
                  *
                </span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-input"
                placeholder="E.g Thanksgiving giveaway"
              />
            </div>
            <div className="form-group">
              <label>
                Organization Name{" "}
                <span
                  style={{
                    color: "red",
                    fontWeight: "800",
                    transform: "translateY(-2px)",
                  }}
                >
                  *
                </span>
              </label>
              <input
                required
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="E.g Google"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>
                Number of Participants{" "}
                <span
                  style={{
                    color: "red",
                    fontWeight: "800",
                    transform: "translateY(-2px)",
                  }}
                >
                  *
                </span>
              </label>
              <input
                required
                type="number"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                min="1"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Organization Logo:</label>
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
                style={{
                  height: "50px",
                  padding: "0",
                  background: "transparent",
                }}
              />
            </div>
            <div
              className="btn-box"
              style={{
                gridColumn: "1/-1",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button type="submit" className="btn primary">
                Start Session
              </button>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="btn primary"
                style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
              >
                <FaEye />
                Preview
              </button>
            </div>
          </form>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h2>Preview</h2>
            <div style={{ pointerEvents: "none" }}>
              <Lottery
                session={{
                  title: title || "Sample Title",
                  participants: participants ? parseInt(participants) : 150,
                  logo: logo,
                  theme,
                  organizationName: organizationName.trim(),
                }}
                onReset={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionForm;
