/*******************************************
 ******************************************
        VARIABLES START (Change values here)
*******************************************
 *******************************************/
const LaunchAgentExtension = "plist";
const LaunchAgentsPath = "/Users/Talha/Library/LaunchAgents";
const ImirrorLaunchAgentName = "com.example.imirror";
const BluetoothLaunchAgentName = "com.example.bluetooth";
const ImirrorMenuAppTitle = "Imirror Binary";
const BluetoothMenuAppTitle = "Bluetooth Binary";
/*******************************************
 ******************************************
        VARIABLES END
*******************************************
 *******************************************/
const ImirrorLaunchAgentPath = `${LaunchAgentsPath}/${ImirrorLaunchAgentName}.${LaunchAgentExtension}`;
const BluetoothLaunchAgentPath = `${LaunchAgentsPath}/${BluetoothLaunchAgentName}.${LaunchAgentExtension}`;

const BinaryMappingForService = {
  [ImirrorMenuAppTitle]: ImirrorLaunchAgentPath,
  [BluetoothMenuAppTitle]: BluetoothLaunchAgentPath,
};

const BinaryMappingForServiceList = {
  [ImirrorLaunchAgentName]: ImirrorMenuAppTitle,
  [BluetoothLaunchAgentName]: BluetoothMenuAppTitle,
};

exports.BinaryMappingForService = BinaryMappingForService;
exports.BinaryMappingForServiceList = BinaryMappingForServiceList;
exports.ImirrorLaunchAgentName = ImirrorLaunchAgentName;
exports.BluetoothLaunchAgentName = BluetoothLaunchAgentName;
exports.ImirrorMenuAppTitle = ImirrorMenuAppTitle;
exports.BluetoothMenuAppTitle = BluetoothMenuAppTitle;
