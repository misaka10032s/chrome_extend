import { contextMenus } from "./js/setting.js";
import { executeScript, getDomain, executeStoreScript } from "./js/methods.js";
import { tabStore } from "./js/store.js";
import { _initSwal } from "./js/sweetalert2@11.js";

// ########################################################
// ######################### menus ########################
// ########################################################
// created contextMenus
const menuIds = new Set();
for (const [key, value] of Object.entries(contextMenus)) {
    // check if the id is created
    if(menuIds.has(key)){
        continue;
    }

    var x = chrome.contextMenus.create({
        id: key,
        type: value.type ?? "normal",
        title: value.title,
        contexts: value.contexts,
    });
    menuIds.add(x);
    console.log(x)
}

// ########################################################
// ####################### listener #######################
// ########################################################
// onClicked listener
chrome.contextMenus.onClicked.addListener(
    async (info, tab) => {
        console.log("info: ", info);
        console.log("tab: ", tab);
        if(info.menuItemId in contextMenus){
            await contextMenus[info.menuItemId].script(info, tab);
        }
});

// onUpdated listener
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    console.log("onUpdated tabId: ", tabId, changeInfo, tab);
    console.log(chrome.storage)
    if(!tab.url.match("^http") && !tab.url.match(`^chrome-extension://${ chrome.runtime.id }`)){
        return;
    }
    // execute script when tab is completely loaded
    if (changeInfo.status === 'complete') {
        if(tabId in tabStore.ids){
            console.log("executeScript: ", tabId, tabStore.ids[tabId]);
            executeStoreScript(tabStore.ids, tabId, tab);
        }

        const domain = getDomain(tab.url);
        if(domain in tabStore.domains){
            console.log("executeScript: ", domain, tabStore.domains[domain]);
            executeStoreScript(tabStore.domains, domain, tab);
        }

        // init Swal for each tab
        executeScript(tabId, _initSwal);
    }
});