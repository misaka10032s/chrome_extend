import { reloadImage, anitWhite, navigation, searchSaucenao, searchAscii2d, getBahaImg, deQrcode } from "./script.js";
import { executeScript, getDomain, executeStoreScript } from "./methods.js";

// ########################################################
// #                                                      #
// #                     context menu                     #
// #                                                      #
// ########################################################
export const contextMenus = {
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
            });
        }
    },
    textWnacg: {
        title: "使用 Wnacg搜尋: %s",
        contexts: ["selection"],
        script: async (info, tab) => {
            await chrome.tabs.create({
                url: `http://wnacg.org/search/?q=${ info.selectionText }`,
            });
        }
    },
    imageSaucenao: {
        title: "使用 saucenao搜尋圖片", // https://saucenao.com
        contexts: ["image"],
        script: async (info, tab) => {
            const newTab = await chrome.tabs.create({
                url: "https://saucenao.com/",
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
    deQrcode: {
        title: "解析QRcode",
        contexts: ["image"],
        script: async (info, tab) => {
            console.log(info);
            await executeScript(tab.id, deQrcode, tab);
            // await executeScript(tab.id, (info) => {
            //     console.log([src=`'${ info.srcUrl }'`], document.querySelector(`[src='${ info.srcUrl }']`))
            // }, info);
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
    {
        reg: "https://www.pixiv.net/member_illust.php\\\\?mode=medium&illust_id=(\\d+)",
        url: "https://www.pixiv.net/artworks/$1",
    },
    // remove "fbclid" query from url
    {
        query: {
            remove: ["fbclid"],
        }
    }
]
