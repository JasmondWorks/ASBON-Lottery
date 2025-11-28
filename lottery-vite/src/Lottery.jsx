import { useState, useRef, useMemo } from "react";
import Confetti from "react-confetti";

function Lottery({ session, onReset }) {
  const [results, setResults] = useState(
    () => JSON.parse(localStorage.getItem("results")) || []
  );

  const ticketNumbers = useMemo(() => {
    const total = session.participants || 150;
    return Array.from({ length: total }, (_, i) => i + 1).filter(
      (num) => !results.some((r) => r.ticketNumber === num)
    );
  }, [session, results]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [number, setNumber] = useState("");
  const [showNumber, setShowNumber] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const drumRollRef = useRef(new Audio("/drum-roll-sound-effect.mp3"));
  const crashRef = useRef(new Audio("/crash.mp3"));

  const wait = (seconds) =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));

  const spin = async () => {
    if (isSpinning || ticketNumbers.length === 0) return;
    setIsSpinning(true);
    setShowConfetti(false);
    setShowNumber(true);
    drumRollRef.current.play();

    let lastNum;
    for (let i = 0; i < 55; i++) {
      await wait(0.1);
      const randNum = Math.floor(Math.random() * ticketNumbers.length);
      lastNum = ticketNumbers[randNum];
      setNumber(lastNum);
    }

    setIsSpinning(false);
    drumRollRef.current.pause();
    drumRollRef.current.currentTime = 0;
    crashRef.current.play();
    setShowConfetti(true);

    const winner = lastNum;
    const newResult = {
      index: results.length + 1,
      ticketNumber: winner,
    };
    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    localStorage.setItem("results", JSON.stringify(updatedResults));
  };

  const reset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the entire session? This cannot be undone"
      )
    ) {
      onReset();
    }
  };

  return (
    <div className="content-wrapper">
      <header className="header">
        <div className="container">
          {session.logo && (
            <img src={session.logo || "/asbon.png"} alt="logo" />
          )}
          <button className="btn reset" onClick={reset}>
            Reset
          </button>
        </div>
      </header>
      <div className="jack-box">
        <div className="container">
          <h1 className="title">{session.title}</h1>
          <div className="tag">
            Tickets remaining: {ticketNumbers.length} /{" "}
            {session.participants || 150}
          </div>
          {session.logo && (
            <img className="jack" src={session.logo} alt="Logo" />
          )}
          <h1 className={`number ${showNumber ? "" : "hide"}`}>{number}</h1>
          <button
            className="btn primary"
            onClick={spin}
            disabled={isSpinning || ticketNumbers.length === 0}
          >
            Spin
          </button>
          <button
            className="btn neutral"
            onClick={() => setShowResultsModal(true)}
          >
            View Results
          </button>
        </div>
      </div>
      {session.organizationName && (
        <footer className="footer">
          <div>
            <p>
              By{" "}
              <span className="organization-name">
                {session.organizationName}
              </span>
            </p>
          </div>
        </footer>
      )}
      {showResultsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowResultsModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowResultsModal(false)}
            >
              ×
            </button>
            <h2>Results</h2>
            <div className="results">
              <div className="container">
                <div className="results-container">
                  <div className="row head">
                    <div>Index</div>
                    <div>Ticket number</div>
                  </div>
                  {results.map((result) => (
                    <div key={result.index} className="row body">
                      <div>{result.index}</div>
                      <div>{result.ticketNumber}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showConfetti && <Confetti />}
    </div>
  );
}

export default Lottery;
