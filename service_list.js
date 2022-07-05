const { spawn } = require("child_process");
const { Service } = require("./service");
const {
  BinaryMappingForServiceList: BinaryMapping,
  ImirrorLaunchAgentName,
  BluetoothLaunchAgentName,
} = require("./constants");

class ServiceList {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.runningProcesses = [];
    this.stoppedProcesses = [];
  }

  clear() {
    this.rootElement.innerHTML = "";
  }

  load() {
    const childProcess = spawn("launchctl", ["list"]);
    this.clear();
    childProcess.stdout.on("data", (data) => {
      const lines = data.toString().split("\n");
      lines.shift();
      if (lines.length > 0) {
        for (const line of lines) {
          const parts = line.split(/\s+/);
          if (
            parts.length === 3 &&
            [ImirrorLaunchAgentName, BluetoothLaunchAgentName].includes(
              parts[2]
            )
          ) {
            // remove from stopped processes
            const stoppedProcessIndex = this.stoppedProcesses.findIndex(
              (el) => el === BinaryMapping[parts[2]]
            );
            if (stoppedProcessIndex !== -1) {
              this.stoppedProcesses.splice(stoppedProcessIndex, 1);
            }
            // add to running processes
            if (!this.runningProcesses.includes(BinaryMapping[parts[2]])) {
              this.runningProcesses.push(BinaryMapping[parts[2]]);
            }
          }
        }
      } else {
        const tip = document.createElement("LI");
        const tipText = document.createTextNode("No available service");
        tip.appendChild(tipText);
        this.rootElement.appendChild(tip);
      }
      for (const item of [ImirrorLaunchAgentName, BluetoothLaunchAgentName]) {
        // add to stopped processes if not found in running processes
        const runningProcessIndex = this.runningProcesses.findIndex(
          (el) => el === BinaryMapping[item]
        );
        if (
          runningProcessIndex === -1 &&
          !this.stoppedProcesses.includes(BinaryMapping[item])
        ) {
          this.stoppedProcesses.push(BinaryMapping[item]);
        }
      }
    });
    childProcess.on("close", () => {
      this.clear();
      for (const runningProcess of this.runningProcesses) {
        const service = new Service(runningProcess, "started");
        service.draw(this.rootElement);
      }
      for (const stoppedProcess of this.stoppedProcesses) {
        const service = new Service(stoppedProcess, "stopped");
        service.draw(this.rootElement);
      }
      this.runningProcesses = [];
      this.stoppedProcesses = [];
    });
  }
}

exports.ServiceList = ServiceList;
