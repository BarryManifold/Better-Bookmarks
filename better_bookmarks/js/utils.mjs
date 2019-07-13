/*
 * file        : utils.mjs
 * description : This file is a JavaScript module intended to
 *               contain utility functions.
 *
 */

/*
 * Walks the bookmark tree and adds the folders
 * to the popup menu.
 *
 * @return undefined
 *
 */
export function addBookmarkContent() {
    var folderText, bmarkText, search;
    /*
    * Walks the bookmark tree adding
    * list tags for each folder it finds
    * along the way.
    *
    *
    * @param bs: the child array.
    * @return undefined
    *
    */
    function walkChildren(bs) {
        if (bs == undefined || bs.length == 0) {
            return;
        }
        for (let i = 0; i < bs.length; i++) {
            let node = bs[i];
            // Folder case.
            if (node.id != 0 && node.url == undefined) {
                // Create new folder dropdown.
                folderText += "<div id=\"folder" +
                              node.id + "\" class=\"dropdown\">" +
                              "<a name=\"" +
                              node.title +
                              "\" class=\"dropbtn\" " +
                              "href=\"#\">";
                // Chrome allows untitled folders, so
                // check for them.
                if (node.title.length > 0) {
                    folderText += node.title + "</a>";
                }
                // Untitled bookmark folder.
                else {
                    folderText += "untitled</a>";
                }
            }
            // Bookmark case.
            if (node.url != undefined && node.id != 0) {
                // Only create a bookmark dropdown if
                // the parent folder isn't the root,
                // i.e., a parentId of zero.
                if (node.parentId != undefined &&
                    node.parentId != 0) {
                    
                    // Create a new bookmark "list."
                    if (bmarkText.length == 0) {
                        bmarkText += "<div id=\"folderDropdown" +
                                     node.id + "\" " +
                                     "class=\"dropdown-content\">";
                    }
                }
                // Create a new bookmark entry.
                bmarkText += "<a id=\"bookmark" + node.id +
                             "\" href=\"#\">" + node.title +
                             "</a>";
            }
            walkChildren(node.children);
        }
        // Close out the bookmark list and folder dropdown,
        // then reset it.
        if (bmarkText != 0) {
            folderText += bmarkText + "</div></div>";
            bmarkText   = "";
        }
    }
    // Get the search bar div so we can place our
    // folder dropdowns after it.
    search = document.getElementById("search");
    // Create the necessary HTML and add it to the DOM.
    chrome.bookmarks.getTree(function(bs) {
        folderText = "";
        bmarkText  = "";
        walkChildren(bs);
        search.insertAdjacentHTML("afterend", folderText);
    });
}

/*
 * Validates the search bar text and if the
 * input is valid, passes it to a callback
 * that searches for that text in the bookmarks.
 *
 * ==== Still in progress. ====
 *
 */
export function validateForm() {
    var val = document.forms["searchForm"]["searchBar"].value;
    alert(val);
}

function toggleBookmarks() {
    document.getElmentById("folderDropdown")
            .classList
            .toggle("show");
}

export function addBookmarksToPopup() {
    const folderList = document.getElementById("folderList");
    alert(folderList);
    const folders    = folderList.childNodes;
    for (let i = 0; i < folders.length; i++) {
        var folder = folders[i];
        folder.onclick = toggleBookmarks;
    }
}