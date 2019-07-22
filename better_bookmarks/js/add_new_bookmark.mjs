/**
 * @file This file contains code for manipulating the modal,
 *     i.e., popup, that displays when a user clicks the
 *     "add bookmark" button in the primary extension popup.
 *
 */

import {predictCategory, preprocess} from './predictCategory.mjs'

/**
*  Creates a new bookmark given a bookmark title
*  and url.
*
*  @author Brady McGrath
*  @author Kyle Head
*
*  @param {string} title - The title of the page being
*      bookmarked.
*  @param {string} url - The url of the page being
*      bookmarked.
*  @return {undefined}
*
*/
function autofiller(title, url,
                    modal, span,
                    btn2) {
    console.log("Entering autofiller in add_new_bookmark.js...");
    // When the user clicks the 'Bookmark' button,
    // Display the modal
    modal.style.display = "block";
    // Autofill the site Title as the bookmark name
    document.getElementById("newName").value = title;
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
    const bookURL = document.getElementById("newName");
    // When a user clicks the Create button, save a new bookmark
    btn2.onclick = function() {
        chrome.bookmarks.create({ "parentId" : null
                                , "title"    : title
                                , "url"      : url
                                });
    }
}

/**
 * Displays the modal when the "add bookmark"
 * button is clicked and presents the user with
 * a title (defaults to page title) and folder
 * (defaults to the one recommended by predictCategory).
 *
 * @author Brady McGrath
 * @author Kyle Head
 *
 * @param {Object} btn - the "add bookmark" button object.
 * @return {undefined}
 *
 */
export function addBookmark(btn) {
    return ( () => {
        const modal = document.getElementById("myModal");
        // Get the button that creates a bookmark
        const btn2  = document.getElementById("makeBtn");
        // Get the <span> element that closes the modal
        const span  = document.getElementsByClassName("close")[0];

        /* 
        * Since executeScript doesn't seem to like when
        * I set the file property with content equivalent
        * to what follows below, we have to resort to the
        * below solution until we figure out how to use a
        * file with the exact same content, or an even better
        * solution that doesn't require the use of executeScript.
        *
        * NOTE: Chrome doesn't allow the injection of scripts
        *       for any chrome://* URLs, nor does it allow
        *       injection in the default chrome new tab page,
        *       i.e., your homepage.
        */
        const codeToExecute =
            "const metas = document.getElementsByTagName('meta');\n" +
            "let pageDescription;\n" +
            "for (let i = 0; i < metas.length; i++) {\n" +
            "    const meta = metas[i];\n" +
                // Some websites don't conform to the norm,
                // thus requiring toLowerCase().
            "    if (meta.name.toLowerCase() === 'description'){\n" +
            "        pageDescription = meta.content;\n" +
            "    }\n" +
            "}\n" +
            "pageDescription";

        // Get the current tab's ID, title, and URL.
        // After getting that information, call
        // executeScript to get the description if
        // available.
        chrome.tabs.getSelected(null, (tab) => {
            const tabId   = tab.id;
            const usableT = tab.title;
            const usableU = tab.url;
            let usableD;

            // Get the description for the page being
            // bookmarked.
            chrome.tabs.executeScript(tabId, { code  : codeToExecute
                                             , runAt : "document_start"
                                             }, (results) => {
                try {
                    // Should be the description of the page.
                    usableD = results[0];

                    console.log("title = " + usableT + "\n" +
                                "url = " + usableU + "\n" +
                                "description = " + usableD);

                    // Prepare the description for storing.
                    let obj = {};
                    const key = "_" + tabId;
                    obj[key] = usableD;
                    console.log("obj." + key + " = " + obj[key]);

                    // Got the description.
                    if (usableD) {
                        chrome.storage.sync.set(obj);
                    }
                    // Description was null, so either it
                    // doesn't exist or we gotta get it
                    // from storage.
                    else {
                        chrome.storage.sync.get([key], (result) => {
                            const description = result[key];

                            console.log("description was null in " +
                                        "executeScript in " +
                                        "add_new_bookmark.js...");
                            console.log("result[" + key + "]: " +
                                        description);

                            usableD = description;
                        });
                    }
                    // Fill the title and folder fields that
                    // the user sees on the modal.
                    autofiller(usableT, usableU, modal, span, btn2);
                }
                catch(err) {
                    console.log("Caught error in executeScript callback " +
                                "in file modal.js.");
                    console.log("Error: " + err);
                }
            });
        });
    // Close out the arrow function being returned.
    });
// Close out addBookmark function
}