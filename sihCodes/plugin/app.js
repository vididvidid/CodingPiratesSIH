// Define the plugin registry
const pluginRegistry = {};

// Function to register a plugin
function registerPlugin(name, src) {
    pluginRegistry[name] = src;
}

// Function to load a plugin into the iframe
function loadPlugin(name) {
    const src = pluginRegistry[name];
    if (src) {
        document.getElementById('plugin-iframe').src = src;
    } else {
        console.error(`Plugin "${name}" not found.`);
    }
}

// Register a sample plugin with a URL (for demonstration)
registerPlugin('samplePlugin', 'plugin.html');

// Event listener for loading a plugin
document.getElementById('load-plugin').addEventListener('click', () => {
    loadPlugin('samplePlugin');
});
