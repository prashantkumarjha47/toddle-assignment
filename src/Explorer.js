import React, { useEffect, useState } from "react";
import "./Explorer.scss";
import UpArrow from "./components/Icon/UpArrow";
import SearchIcon from "./components/Icon/SearchIcon";
import fileIcon from "./assets/images/file.png";
import folderIcon from "./assets/images/folder.png";
import AddIcon from "./components/Icon/AddIcon";
import CloseIcon from "./components/Icon/CloseIcon";
import ExplorerSrvc from "./services/explorer.service";
/**
 * Content DS:
 *   - id
 *   - name
 *   - type: file, folder
 *   - parentId
 */

export default function Explorer() {
  const [activeIndex, setActiveIndex] = useState();
  const [contents, setContents] = useState([]);
  const [pastIndexes, setPastIndexes] = useState([]);
  const [filename, setFilename] = useState("");
  const [dropdown, setDropdown] = useState([]);
  const [crateFolderModal, setCrateFolderModal] = useState(false);
  const [contentType, setContentType] = useState("file");
  const [search, setSearch] = useState("");
  const [rootId, setRootId] = useState();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    ExplorerSrvc.getAllExplorer().then((res) => {
      setContents([...res]);

      const id = res.find((r) => r.parentId === null)?.id;
      setRootId(id);
      setActiveIndex(id);
    });
  }, []);

  const create = (type) => {
    const filenameExist = contents
      .filter((content) => content.parentId === activeIndex)
      .some((content) => content.name === filename);

    if (filenameExist) {
      console.log("Filename already exist");
      setShowError(true);
      return;
    }
    setDropdown([...dropdown, false]);
    return {
      id: Date.now(),
      name: filename,
      type: type,
      parent: activeIndex,
    };
  };

  const addNewFile = () => {
    const newFile = create("file");

    if (newFile) {
      setDropdown([...dropdown, false]);
      ExplorerSrvc.addContent(newFile).then((contents) => {
        setContents(contents);
        setFilename("");
      });
    }
  };

  const addNewFolder = () => {
    const newFile = create("folder");

    if (newFile) {
      setDropdown([...dropdown, false]);
      ExplorerSrvc.addContent(newFile).then((contents) => {
        setFilename("");
        setContents(contents);
      });
    }
  };

  const handleDelete = (e, { id }) => {
    console.log(id);
    e.stopPropagation();

    ExplorerSrvc.deleteContent(id).then((contents) => setContents(contents));
  };

  const handleRename = (content, newName) => {
    ExplorerSrvc.updateContent({ ...content, name: newName }).then((contents) =>
      setContents(contents)
    );
  };

  const handleOpenDrodown = (e, i) => {
    console.log(e, i);
    e.preventDefault();
    dropdown[i] = !dropdown[i];
    setDropdown([...dropdown]);
  };
  const handleOpenCreateFolderModal = () => {
    setCrateFolderModal(!crateFolderModal);
  };

  const onSetContentType = (type) => {
    console.log(type, 103);
    setContentType(type);
  };

  const createContent = () => {
    if (contentType === "file") {
      addNewFile();
    } else if (contentType === "folder") {
      addNewFolder();
    }
  };

  const handleCopy = (content) => {
    alert("will implement later");
  };

  const stepNBack = (n) => {
    setPastIndexes(pastIndexes.slice(0, n));
    setActiveIndex(pastIndexes[n]);
  };

  const getNameByIndex = (pastIndex) => {
    return contents?.find((content) => content.id === pastIndex)?.name;
  };

  return (
    <div className="page-wrapper">
      <div className="topHeader">
        <div className="topHeader__left">
          <div className="breadcrumbs-group">
            <div className="backBtn">
              {activeIndex !== rootId && (
                <button
                  className="btn btn-inline-icon"
                  type="button"
                  onClick={() => stepNBack(pastIndexes.length - 1)}
                >
                  <UpArrow />
                </button>
              )}
            </div>
            <div className="breadcrumbs">
              <ul>
                {pastIndexes.map((pastIndex, index) => (
                  <li onClick={() => stepNBack(index)}>
                    {getNameByIndex(pastIndex)}
                  </li>
                ))}
                <li>{getNameByIndex(activeIndex)}</li>
              </ul>
            </div>
          </div>
          {/* <div className="search-group">
            <div className="backBtn">
              <button className="btn btn-inline-icon" type="button">
                <CloseIcon />
              </button>
            </div>
            <div className="search-text">
              Search Page: type atleat 1 charrater
            </div>
          </div> */}
        </div>
        <div className="topHeader__right">
          <div className="headSearch">
            <input
              type="text"
              className="form-control"
              placeholder="Search for anything"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="searchicon">
              <SearchIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="folder-row">
          {contents
            .filter((content) => content.parentId === activeIndex)
            .filter((content) =>
              content.name?.toLowerCase().includes(search?.toLowerCase())
            )
            .map((content, i) => {
              return content.type === "file" ? (
                <div className="folder-row__item">
                  <div
                    onContextMenu={(e) => handleOpenDrodown(e, i)}
                    onBlur={(e) => handleOpenDrodown(e, i)}
                    className="fileitem"
                  >
                    <span className="icon">
                      <img src={fileIcon} alt={content.name} />
                    </span>
                    <span>{content.name}</span>
                  </div>
                  {dropdown[i] && (
                    <div className="fileActionDropdown">
                      <ul>
                        <li>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={(e) => {
                              handleCopy(content);
                              handleOpenDrodown(e, i);
                            }}
                          >
                            Copy
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={(e) => {
                              handleRename(content, `${content.name}_rename`);
                              handleOpenDrodown(e, i);
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
                              handleOpenDrodown(e, i);
                            }}
                            type="button"
                            className="dropdown-item"
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="folder-row__item">
                  <button
                    className="btn btn-inline-icon fileitem"
                    onDoubleClick={() => {
                      setSearch("");
                      setPastIndexes([...pastIndexes, activeIndex]);
                      setActiveIndex(content.id);
                    }}
                    onContextMenu={(e) => handleOpenDrodown(e, i)}
                    // onBlur={(e) => handleOpenDrodown(e, i)}
                  >
                    <span className="icon">
                      <img src={folderIcon} alt={content.name} />
                    </span>
                    <span>{content.name}</span>
                  </button>
                  {dropdown[i] && (
                    <div className="fileActionDropdown">
                      <ul>
                        <li>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={(e) => {
                              handleCopy(content);
                              handleOpenDrodown(e, i);
                            }}
                          >
                            Copy
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={(e) => {
                              handleRename(content, `${content.name}_rename`);
                              handleOpenDrodown(e, i);
                            }}
                            className="dropdown-item"
                          >
                            Rename
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={(e) => {
                              handleDelete(e, content);
                              handleOpenDrodown(e, i);
                            }}
                            type="button"
                            className="dropdown-item"
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          <div className="folder-row__item folder-row__item--addbtn ">
            <button
              type="button"
              onClick={handleOpenCreateFolderModal}
              className="btn btn-inline-icon btn-add"
            >
              <AddIcon />
            </button>
          </div>
        </div>
      </div>
      {crateFolderModal && (
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
                <div
                  className="radioItem"
                  onClick={() => onSetContentType("file")}
                >
                  <input
                    checked={contentType === "file"}
                    id="file"
                    type="radio"
                    name="file"
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
                  <p className="error-message">
                    File / Folder Name alredy exists!
                  </p>
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
      )}
      {/* <button onClick={addNewFile}>Add New File</button>
      <button onClick={addNewFolder}>Add New Folder</button>
      <input
        type="text"
        value={filename}
        onChange={(e) => {
          setFilename(e.target.value);
        }}
      /> */}
    </div>
  );
}
