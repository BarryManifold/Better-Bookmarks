var port = chrome.runtime.connect();

window.addEventListener("message", (event) => {
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        console.log("Content script received: " + event.data.text);
        port.postMessage(event.data.text);
    }
}, false);

const title = document.getElementsByTagName("title")[0];
const metas = document.getElementsByTagName("meta");
alert("title = " + title.innerHTML);
for (let i = 0; i < metas.length; i++) {
    var description;
    const meta = metas[i];
    if (meta.name == "description") {
        alert(meta.name + " = " + meta.content);
        description = meta.content;
    }

    if (!description) {
        description = "";
    }
    chrome.storage.sync.set({ title: title
                            , description: description
                            });
}
chrome.storage.sync.get(['description']
                        , (result) => {
                            alert("result.title = " +
                                    result.title +
                                    " | result.description = " +
                                    result.description);
                        });
