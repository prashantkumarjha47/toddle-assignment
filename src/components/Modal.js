import React from "react";

export default function Modal() {
  return (
    <div id="myModal" className="modal-open">
      <div className="modal-content">
        <span className="close">&times;</span>
        <p>Some text in the Modal..</p>
      </div>
    </div>
  );
}
