/*
 * file        : background.js
 * description : This file contains various event listeners and
 *               their associated callback functions to be ran
 *               in the background.
 *
 */

// Create context menu items.
chrome.contextMenus.removeAll();
chrome.contextMenus.create({
    id: "first-id",
    title: "first",
    contexts: ["browser_action"]
});
// Context menu onClicked listener.
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    alert('first');
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (var key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
                    'Old value was "%s", new value is "%s".',
                    key,
                    namespace,
                    storageChange.oldValue,
                    storageChange.newValue);
    }
});
