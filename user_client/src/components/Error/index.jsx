import React from "react";
import "./Error.css";
export default ({ error, goBack }) => (
  <div className="error-page-container">
    <div className="error-page-modal">
      <div className="error-message">{error}</div>
      <hr className="error-hline" />
      <a className="error-go-back-btn" href={goBack || "/"} >
        Go back
      </a>
    </div>
  </div>
);
