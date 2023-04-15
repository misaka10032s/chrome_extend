import { contextMenus, redirectOptions } from "./static/module/setting.js";
import { executeScript, getDomain, executeStoreScript } from "./static/module/methods.js";
import { tabStore } from "./static/module/store.js";
import { _initSwal } from "./static/module/sweetalert2@11.js";

// ########################################################
// ######################### menus ########################
// ########################################################
// created contextMenus
const menuIds = new Set();
for (const [key, value] of Object.entries(contextMenus)) {
    // check if the id is created
    if (menuIds.has(key)) {
        continue;
    }

    var x = chrome.contextMenus.create({
        id: key,
        type: value.type ?? "normal",
        title: value.title,
        contexts: value.contexts,
    });
    menuIds.add(x);
}

// ########################################################
// ####################### listener #######################
// ########################################################
// onClicked listener
chrome.contextMenus.onClicked.addListener(
    async (info, tab) => {
        console.log("info: ", info);
        console.log("tab: ", tab);
        if (info.menuItemId in contextMenus) {
            await contextMenus[info.menuItemId].script(info, tab);
        }
    });

// onUpdated listener
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    // console.log("onUpdated tabId: ", tabId, changeInfo, tab);
    if (!tab.url.match("^http") /*&& !tab.url.match(`^chrome-extension://${ chrome.runtime.id }`)*/) {
        return;
    }
    // execute script when tab is loading
    if (changeInfo.status === 'loading') {
        // deprecated
        // executeScript(tabId, redirectUrl, redirectOptions);
    }
    // execute script when tab is completely loaded
    if (changeInfo.status === 'complete') {
        if (tabId in tabStore.ids) {
            console.log("executeScript: ", tabId, tabStore.ids[tabId]);
            executeStoreScript(tabStore.ids, tabId, tab);
        }

        const domain = getDomain(tab.url);
        if (domain in tabStore.domains) {
            console.log("executeScript: ", domain, tabStore.domains[domain]);
            executeStoreScript(tabStore.domains, domain, tab);
        }

        // init Swal for each tab
        executeScript(tabId, _initSwal);
    }
});

chrome.webNavigation.onBeforeNavigate.addListener(
    async function(details) {
        // redirector
        // console.log("details", details);
        let origUrl = details.url;
        // console.log("old href", origUrl)
        const {newUrl, isChanged} = redirectUrl(redirectOptions, origUrl);
        // console.log("new href", newUrl);
        if(isChanged) chrome.tabs.update(details.tabId, {url: newUrl});
    },
    {urls: ["<all_urls>"]}
);

const redirectUrl = (options, origUrl) => {
    if(!origUrl && typeof window != "undefined"){
        origUrl = window.location.href;
    }
    var newUrl = origUrl;

    for(let i in options){
        const rule = options[i];
        // use regexp, if rule.reg and rule.url are both exist
        if(rule.reg && rule.url){
            const tmpReg = new RegExp(rule.reg);
            if(!newUrl.match(tmpReg)) continue;
            newUrl = newUrl.replace(tmpReg, rule.url);
        }
        // use query, if rule.query is exist
        else if(rule.query){
            const u = new URL(newUrl);
            // if rule.query.remove is String, delete it
            if(typeof rule.query.remove == "string") {
                u.searchParams.delete(rule.query);
            }
            // if rule.query.remove is Array, delete all of them
            else if(Array.isArray(rule.query.remove)){
                for(let j in rule.query.remove){
                    u.searchParams.delete(rule.query.remove[j]);
                }
            }

            // if rule.query.add is String, add it
            if(typeof rule.query.add == "string") {
                u.searchParams.append(rule.query);
            }
            // if rule.query.add is Array, add all of them
            else if(Array.isArray(rule.query.add)){
                for(let j in rule.query.add){
                    u.searchParams.append(rule.query.add[j]);
                }
            }
            newUrl = u.href;
        }
    }
    const isChanged = newUrl != origUrl;
    if(typeof window != "undefined" && isChanged) window.history.replaceState({}, document.title, newUrl);
    return {newUrl, isChanged};
}
    