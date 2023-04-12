import { navigation } from "./js/navigation.js";
import { search_saucenao } from "./js/image-saucenao.js";
import { search_ascii2d } from "./js/image-ascii2d.js";
// @@@@test
import { gogo } from "./js/test.js";

// ########################################################
// ####################### variables ######################
// ########################################################

// tabs to execute script after status is complete
// tabId: string for js file, function for executeScript
export const tabStore = {};

// ########################################################
// ######################### menus ########################
// ########################################################
// normal
chrome.contextMenus.create({
    id: "reload_image",
    type: "normal",
    title: "重載失敗圖片",
    contexts: ["page"],
});
chrome.contextMenus.create({
    id: "anit-white",
    type: "normal",
    title: "解除反白限制",
    contexts: ["page"],
});

// selection
chrome.contextMenus.create({
    id: "navigation",
    type: "normal",
    title: "goto: %s",
    contexts: ["selection"],
});
chrome.contextMenus.create({
    // @@@@test
    id: "test",
    type: "normal",
    title: "test: %s",
    contexts: ["selection"],
});

// image
chrome.contextMenus.create({
    id: "image-saucenao",
    type: "normal",
    title: "search image at saucenao", // https://saucenao.com
    contexts: ["image"],
});
chrome.contextMenus.create({
    id: "image-ascii2d",
    type: "normal",
    title: "search image at ascii2d", // https://ascii2d.net
    contexts: ["image"],
});

// ########################################################
// ######################## methods #######################
// ########################################################
const createNewTab = async (url, scriptName, ...args) => {
    chrome.tabs.create({
        url: url,
    }, async tab => {
        console.log("image tab: ", tab, url);
        if(scriptName) await executeScript(tab.id, scriptName, ...args);
    });
}

const executeScript = async (tabId, file, ...args) => {
    if (tabId == "current") {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });
        // console.log("executeScript: ", tabId, tab);
        tabId = tab.id;
        if(!tab.url.match("^http")){
            return;
        }
    }
    // if file is string, execute file
    if(typeof file == "string"){
        await chrome.scripting.executeScript({
            target: {
                tabId: tabId
            },
            files: [`js/${ file }`],
            // files: [`chrome-extension://${ chrome.runtime.id }/js/${ file }`],
        });
    }
    // if file is function, execute function
    else if(typeof file == "function"){
        await chrome.scripting.executeScript({
            target: {
                tabId: tabId
            },
            func: file,
            args: args,
        });
    }
}

// ########################################################
// ####################### listener #######################
// ########################################################
// onClicked listener
chrome.contextMenus.onClicked.addListener(
    async (info, tab) => {
        console.log("info: ", info);
        console.log("tab: ", tab);
        switch(info.menuItemId){
            case "reload_image":
                await executeScript("current", "reload_image.js");
                break;
            case "anit-white":
                await executeScript("current", "anti-white.js");
                break;
            case "navigation":
                console.log(chrome.windows, chrome.windows.WINDOW_ID_CURRENT, await chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}));
                await executeScript("current", navigation, info.selectionText);
                // navigation(info.selectionText);
                break;
            case "image-saucenao":
                createNewTab("https://saucenao.com", search_saucenao, info.srcUrl);
                break;
            case "image-ascii2d":
                createNewTab("https://ascii2d.net", search_ascii2d, info.srcUrl);
                break;

            // @@@@test
            case "test":
                console.log("test: ", info.selectionText);
                var res = await chrome.scripting.executeScript({
                    target: {
                        tabId: tab.id
                    },
                    func: gogo
                });
                console.log("res: ", res);
                break;
        }
});

// onUpdated listener
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    console.log("onUpdated tabId: ", tabId, changeInfo, tab, importScripts);
    if(!tab.url.match("^http") && !tab.url.match(`^chrome-extension://${ chrome.runtime.id }`)){
        return;
    }
    // execute script when tab is completely loaded
    if (changeInfo.status === 'complete') {
        if(tabId in tabStore){
            console.log("executeScript: ", tabId, tabStore[tabId]);
            if(typeof tabStore[tabId] == "function"){
                await tabStore[tabId](tab);
            } else if(typeof tabStore[tabId] == "string") {
                await executeScript(tabId, tabStore[tabId]);
            }
            delete tabStore[tabId];
        }
    }
})