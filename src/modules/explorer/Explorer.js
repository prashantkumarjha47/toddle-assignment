import { lazy, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import ExplorerSrvc from "../../services/explorer.service";
import fileIcon from "../../assets/images/file.png";
import folderIcon from "../../assets/images/folder.png";
import "./Explorer.scss";

const UpArrow = lazy(() => import("../../components/Icon/UpArrow"));
const SearchIcon = lazy(() => import("../../components/Icon/SearchIcon"));
const AddIcon = lazy(() => import("../../components/Icon/AddIcon"));
const Modal = lazy(() => import("../../components/Modal"));
const Dropdown = lazy(() => import("../../components/Dropdown"));

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
  const history = useHistory();
  useEffect(() => {
    ExplorerSrvc.getAllExplorer()
      .then((res) => {
        setContents([...res]);

        const id = res.find((r) => r.parentId === null)?.id;
        setRootId(id);
        setActiveIndex(id);
      })
      .catch((err) => {
        alert("Fail to fetch records. Redirecting back to login page");
        history.push("/login");
      });
  }, []);

  const nameAlreadyExist = (name = filename) => {
    return contents
      .filter((content) => content.parentId === activeIndex)
      .some((content) => content.name === name);
  };

  const create = (type) => {
    const filenameExist = nameAlreadyExist();

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
      ExplorerSrvc.addContent(newFile)
        .then((contents) => {
          setContents(contents);
          setFilename("");
        })
        .catch((err) => {
          alert("Fail to add record.");
        });
    }
  };

  const addNewFolder = () => {
    const newFile = create("folder");

    if (newFile) {
      setDropdown([...dropdown, false]);
      ExplorerSrvc.addContent(newFile)
        .then((contents) => {
          setFilename("");
          setContents(contents);
        })
        .catch((err) => {
          alert("Fail to add record.");
        });
    }
  };

  const handleDelete = (e, { id }) => {
    console.log(id);
    e.stopPropagation();

    ExplorerSrvc.deleteContent(id)
      .then((contents) => setContents(contents))
      .catch((err) => {
        alert("Fail to delete record.");
      });
  };

  const handleRename = (content) => {
    let newName = prompt("Enter new name");
    while (nameAlreadyExist(newName)) {
      newName = prompt("Name already exist, please enter new name");
    }

    ExplorerSrvc.updateContent({ ...content, name: newName })
      .then((contents) => setContents(contents))
      .catch((err) => {
        alert("Fail to update records.");
      });
  };

  const handleOpenDrodown = (e, i) => {
    e.preventDefault();
    dropdown[i] = !dropdown[i];
    setDropdown([...dropdown]);
  };
  const handleOpenCreateFolderModal = () => {
    setCrateFolderModal(!crateFolderModal);
  };

  const onSetContentType = (type) => {
    setContentType(type);
  };

  const createContent = () => {
    if (contentType === "file") {
      addNewFile();
    } else if (contentType === "folder") {
      addNewFolder();
    }
  };

  const handleCopy = (content) => {};

  const stepNBack = (n) => {
    setPastIndexes(pastIndexes.slice(0, n));
    setActiveIndex(pastIndexes[n]);
  };

  const getNameByIndex = (pastIndex) => {
    return contents?.find((content) => content.id === pastIndex)?.name;
  };

  const closeAllDropDown = () => {
    setDropdown(Array(dropdown.length).fill(false));
  };

  return (
    <div className="page-wrapper" onClick={closeAllDropDown}>
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
                  <li key={index} onClick={() => stepNBack(index)}>
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
                <div className="folder-row__item" key={content.id}>
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
                    <Dropdown
                      handleCopy={handleCopy}
                      handleOpenDrodown={handleOpenDrodown}
                      handleRename={handleRename}
                      handleDelete={handleDelete}
                      content={content}
                      index={i}
                      key={content.id}
                    />
                  )}
                </div>
              ) : (
                <div className="folder-row__item" key={content.id}>
                  <button
                    className="btn btn-inline-icon fileitem"
                    onDoubleClick={() => {
                      setSearch("");
                      setPastIndexes([...pastIndexes, activeIndex]);
                      setActiveIndex(content.id);
                    }}
                    onContextMenu={(e) => handleOpenDrodown(e, i)}
                  >
                    <span className="icon">
                      <img src={folderIcon} alt={content.name} />
                    </span>
                    <span>{content.name}</span>
                  </button>
                  {dropdown[i] && (
                    <Dropdown
                      handleCopy={handleCopy}
                      handleOpenDrodown={handleOpenDrodown}
                      handleRename={handleRename}
                      handleDelete={handleDelete}
                      content={content}
                      index={i}
                      key={content.id}
                    />
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
        <Modal
          handleOpenCreateFolderModal={handleOpenCreateFolderModal}
          onSetContentType={onSetContentType}
          setFilename={setFilename}
          setShowError={setShowError}
          createContent={createContent}
          contentType={contentType}
          showError={showError}
          filename={filename}
        />
      )}
    </div>
  );
}
