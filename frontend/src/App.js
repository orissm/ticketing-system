import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const serverURL = "https://ticketing-system-api-o2lm.onrender.com/";
function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [fileFeedbacks, setFileFeedbacks] = useState([]);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await axios.post(`${serverURL}upload`, formData);
    fetchFiles();
  };

  const fetchFiles = async () => {
    const res = await axios.get(`${serverURL}files`);
    setFiles(res.data);
  };

  const fetchFeedback = async (filename) => {
    const res = await axios.get(`${serverURL}feedback/${filename}`);
    setFileFeedbacks(res.data);
  };

  const submitFeedback = async () => {
    await axios.post(`${serverURL}feedback`, {
      filename: selectedFile,
      feedback,
    });
    fetchFeedback(selectedFile);
    setFeedback("");
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="App">
      <h1 className="title">Ticketing System</h1>

      <div className="upload-section">
        <input
          type="file"
          className="file-input"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="btn" onClick={uploadFile}>
          Upload
        </button>
      </div>

      <h2 className="section-title">Uploaded Files</h2>
      <ul className="file-list">
        {files.map((file) => (
          <li key={file} className="file-item">
            <a
              href={`${serverURL}download/${file}`}
              className="file-link"
              download
            >
              {file}
            </a>
            <button
              className="btn"
              onClick={() => {
                setSelectedFile(file);
                fetchFeedback(file);
              }}
            >
              View Feedback
            </button>
          </li>
        ))}
      </ul>

      {selectedFile && (
        <div className="feedback-section">
          <h3 className="feedback-title">Feedback for {selectedFile}</h3>
          <textarea
            rows="4"
            className="feedback-textarea"
            onChange={(e) => setFeedback(e.target.value)}
            value={feedback}
          />
          <button className="btn" onClick={submitFeedback}>
            Submit Feedback
          </button>

          <h4 className="feedback-list-title">Existing Feedback</h4>
          <ul className="feedback-list">
            {fileFeedbacks.map((fdbk, index) => (
              <li key={index} className="feedback-item">
                {fdbk}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
