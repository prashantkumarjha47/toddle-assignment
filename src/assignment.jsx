import React, { Component } from "react";

class App extends Component {
  state = {
    mainFolders: {
      id: new Date().getMilliseconds(),
      name: "",
      type: "dir",
      files: [],
    },
    tempFolder: [],
    currentFolderId: 0,
    showInput: false,
    name: "",
    type: "",
  };

  componentDidMount() {
    this.setState({ currentFolderId: this.state.mainFolders.id });
  }

  toggleInput = () => {
    this.setState({ showInput: !this.state.showInput });
  };

  onCreateFolder = (type) => {
    this.toggleInput();
    this.setState({ type: "dir" });
  };
  onCreateFile = () => {
    this.toggleInput();
    this.setState({ type: "file" });
  };
  onNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  setName = (e) => {
    this.toggleInput();
    if (e === "file") {
      let newFile = {
        id: new Date().getMilliseconds(),
        name: this.state.name,
        content: "",
        type: "file",
      };
      let newMainFolder = this.state.mainFolders;
      newMainFolder.files.push(newFile);
      this.setState({ mainFolders: newMainFolder });
    } else {
      let newFolder = this.state.mainFolders;

      newFolder.files.push({
        id: new Date().getMilliseconds(),
        name: this.state.name,
        type: "dir",
        files: [],
      });
      this.setState({ mainFolders: newFolder });
    }

    this.setState({ name: "" });
  };

  onFolderClick = (folder) => {
    let tempFolder = [...this.state.tempFolder];
    tempFolder.push(this.state.mainFolders);
    this.setState({ mainFolders: folder, tempFolder });
  };

  goBack = () => {
    if (this.state.tempFolder.length)
      this.setState({ mainFolders: this.state.tempFolder.pop() });
  };
  render() {
    let { showInput } = this.state;
    return (
      <div className="App">
        {/*  Modal starts here   */}

        <div className="btn-top">
          <button onClick={() => this.onCreateFolder("folder")}>
            Create Folder{" "}
          </button>
          <button onClick={() => this.onCreateFile("file")}>
            Create Files{" "}
          </button>
          <button
            onClick={this.goBack}
            disabled={!this.state.tempFolder.length}
          >
            Back
          </button>
        </div>
        <div>
          {showInput && (
            <input
              type="text"
              onChange={this.onNameChange}
              onBlur={() => this.setName(this.state.type)}
            />
          )}
        </div>
        <div class="contents">
          {this.state.mainFolders.files.map(
            (content) =>
              content.type === "dir" && (
                <button
                  className="folder"
                  key={content.id}
                  onClick={() => this.onFolderClick(content)}
                >
                  {content.name}
                </button>
              )
          )}
          {this.state.mainFolders.files.map(
            (content) =>
              content.type === "file" && (
                <div className="file" key={content.id}>
                  {content.name}
                </div>
              )
          )}
        </div>
      </div>
    );
  }
}

export default App;
