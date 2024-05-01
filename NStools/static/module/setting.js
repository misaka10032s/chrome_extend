import { reloadImage, anitWhite, navigation, searchSaucenao, searchAscii2d, getBahaImg, exportChatGPTConversation, deQrcode } from "./script.js";
import { executeScript, getDomain, executeStoreScript, injectScript } from "./methods.js";
import { tabVars } from "./store.js";

// ########################################################
// #                                                      #
// #                     context menu                     #
// #                                                      #
// ########################################################
export const contextMenus = {
    openPopup: {
        title: "開啟插件",
        contexts: ["page"],
        script: async (info, tab) => {
            chrome.windows.create({
                type: "popup",
                url: chrome.runtime.getURL("static/template/console/console.html"),
                width: 600,
                height: 400
            });
        }
    },
    reloadImage: {
        title: "重載失敗圖片",
        contexts: ["page"],
        script: async (info, tab) => {
            await executeScript(tab.id, reloadImage);
        }
    },
    anitWhite: {
        title: "解除反白限制",
        contexts: ["page"],
        script: async (info, tab) => {
            await executeScript(tab.id, anitWhite);
        }
    },
    navigation: {
        title: "NWP: %s",
        contexts: ["selection"],
        script: async (info, tab) => {
            await executeScript(tab.id, navigation, info.selectionText);
        }
    },
    textNhentai: {
        title: "使用 N-hentai搜尋: %s",
        contexts: ["selection"],
        script: async (info, tab) => {
            await chrome.tabs.create({
                url: `http://nhentai.net/search/?q=${ info.selectionText }`,
                index: tab.index + 1
            });
        }
    },
    textWnacg: {
        title: "使用 Wnacg搜尋: %s",
        contexts: ["selection"],
        script: async (info, tab) => {
            await chrome.tabs.create({
                url: `http://wnacg.com/search/?q=${ info.selectionText }`,
                index: tab.index + 1
            });
        }
    },
    textRemoveWhite: {
        title: "前往: %s",
        contexts: ["selection"],
        script: async (info, tab) => {
            const rmw = info.selectionText.replace(/[\s]*/g, "");
            const target = rmw.match(/^https?:\/\//) ? rmw : `https://${ rmw }`;
            await chrome.tabs.create({
                url: target,
                index: tab.index + 1
            });
        }
    },
    imageSaucenao: {
        title: "使用 saucenao搜尋圖片", // https://saucenao.com
        contexts: ["image"],
        script: async (info, tab) => {
            const newTab = await chrome.tabs.create({
                url: "https://saucenao.com/",
                index: tab.index + 1
            });
            await executeScript(newTab.id, searchSaucenao, info.srcUrl);
        }
    },
    imageAscii2d: {
        title: "使用 ascii2d搜尋圖片", // https://ascii2d.net
        contexts: ["image"],
        script: async (info, tab) => {
            const newTab = await chrome.tabs.create({
                url: "https://ascii2d.net/",
                index: tab.index + 1
            });
            await executeScript(newTab.id, searchAscii2d, info.srcUrl);
        }
    },
    getBahaImg: {
        title: "取得巴哈姆特圖片",
        contexts: ["page"],
        script: async (info, tab) => {
            await executeScript(tab.id, getBahaImg, tab);
        },
        documentUrlPatterns: ["https://forum.gamer.com.tw/*"]
    },
    exportChatGPTConversation: {
        title: "匯出chatGPT圖片",
        contexts: ["page"],
        script: async (info, tab) => {
            await injectScript(tab.id, "html2canvas.js");
            await executeScript(tab.id, exportChatGPTConversation, tab);
        },
        documentUrlPatterns: ["https://chat.openai.com/*"]
    },
    deQrcode: {
        title: "解析QRcode",
        contexts: ["image"],
        script: async (info, tab) => {
            await injectScript(tab.id, "QrcodeDecoder.js");
            await executeScript(tab.id, deQrcode, tab);
        }
    },
};

// ########################################################
// #                                                      #
// #                     redirector                       #
// #                                                      #
// ########################################################

export const redirectOptions = [
    // old pixiv to new pixiv
    // {
    //     reg: "https://www.pixiv.net/member_illust.php\\\\?mode=medium&illust_id=(\\d+)",
    //     url: "https://www.pixiv.net/artworks/$1",
    // },
    // remove "fbclid" query from url
    {
        query: {
            remove: ["fbclid"],
        }
    },
    {
        host: "twitter.com",
        query: {
            remove: ["t", "s"],
        }
    }
]
