import React from "react";

export default function Dropdown({
  handleCopy,
  handleOpenDrodown,
  handleRename,
  handleDelete,
  content,
  index,
}) {
  return (
    <div className="fileActionDropdown">
      <ul>
        <li>
          <button
            type="button"
            className="dropdown-item"
            onClick={(e) => {
              handleCopy(content);
              handleOpenDrodown(e, index);
            }}
          >
            Copy
          </button>
        </li>
        <li>
          <button
            onClick={(e) => {
              handleRename(content);
              handleOpenDrodown(e, index);
            }}
            type="button"
            className="dropdown-item"
          >
            Rename
          </button>
        </li>
        <li>
          <button
            onClick={(e) => {
              handleDelete(e, content);
              handleOpenDrodown(e, index);
            }}
            type="button"
            className="dropdown-item"
          >
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
}
