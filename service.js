const { spawn } = require("child_process");
const {
  BinaryMappingForService: BinaryMapping,
  ImirrorMenuAppTitle,
  BluetoothMenuAppTitle,
} = require("./constants");

class Service {
  constructor(name, state) {
    this.name = name;
    this.state = state;
  }

  draw(rootElement) {
    this.node = document.createElement("LI");
    this.node.setAttribute("data-state", this.state);

    const statusnode = document.createElement("SPAN");
    statusnode.setAttribute("class", "status");

    const toggler = document.createElement("SPAN");
    toggler.setAttribute("class", "toggler");

    statusnode.appendChild(toggler);
    this.node.appendChild(statusnode);

    const textnode = document.createTextNode(this.name);
    this.node.appendChild(textnode);
    rootElement.appendChild(this.node);
    this.addListener();
  }

  setState(state) {
    this.node.setAttribute("data-state", state);
    this.state = state;
  }

  addListener(callback) {
    this.node.addEventListener("click", () => {
      const oldState = this.state;
      this.setState("waiting");
      let path = undefined;
      let command = undefined;
      if (oldState === "started") {
        command = "unload";
      } else if (oldState === "stopped") {
        command = "load";
      }
      if (this.name === ImirrorMenuAppTitle) {
        path = BinaryMapping[ImirrorMenuAppTitle];
      } else if (this.name === BluetoothMenuAppTitle) {
        path = BinaryMapping[BluetoothMenuAppTitle];
      }
      if (command && path) {
        const childProcess = spawn("launchctl", [command, "-w", path]);
        childProcess.on("close", (code) => {
          if (code === 0) {
            const newState = command === "load" ? "started" : "stopped";
            this.state = newState;
            this.setState(newState);
          }
        });
      }
    });
  }
}

exports.Service = Service;
