import React from "react";
import CloseIcon from "./Icon/CloseIcon";

export default function Modal({
  handleOpenCreateFolderModal,
  onSetContentType,
  setFilename,
  setShowError,
  createContent,
  contentType,
  showError,
  filename,
}) {
  console.log(filename);
  return (
    <div className="crateFolderModal">
      <div className="foder-modal-content">
        <button
          type="Button"
          onClick={handleOpenCreateFolderModal}
          className="btn btn-inline-icon btn-close"
        >
          <CloseIcon />
        </button>
        <div className="modalTitle">Create New</div>
        <div className="ModalBody">
          <div className="radio-group">
            <div className="radioItem" onClick={() => onSetContentType("file")}>
              <input
                checked={contentType === "file"}
                id="file"
                type="radio"
                name="file"
                readOnly
              />
              <label forName="file">File</label>
            </div>
            <div
              className="radioItem"
              onClick={() => onSetContentType("folder")}
            >
              <input
                id="Folder"
                type="radio"
                name="folder"
                checked={contentType !== "file"}
                readOnly
              />
              <label forName="Folder">Folder</label>
            </div>
          </div>
          <div className="form-group">
            <input
              value={filename}
              onChange={(e) => {
                setFilename(e.target.value);
                setShowError(false);
              }}
              className={"form-control " + (showError ? "not-valid" : "")}
            />
            {showError && (
              <p className="error-message">File / Folder Name alredy exists!</p>
            )}
          </div>
          <div className="form-submit">
            <button type="submit" onClick={createContent}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
