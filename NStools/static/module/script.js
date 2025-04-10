import { tabStore } from "./store.js";
import { downloadImages } from "./core.js";
/*
    reloadImage: reload all images which loaded failure on the page
    anitWhite: remove the site to prevent user select
    navigation: goto the certained site
    searchSaucenao: search the image on saucenao
    searchAscii2d: search the image on ascii2d
*/

// @reloadImage
export const reloadImage = () => {
    console.log("reloading image");
    [...document.getElementsByTagName("img")].forEach(e=>{if(e.width==16)e.src=e.src;})
}

// @anitWhite
export const anitWhite = () => {
    console.log("anti-white");
    function R(a) {
        ona = "on" + a;
        if (window.addEventListener) window.addEventListener(a, function (e) {
            for (var n = e.originalTarget; n; n = n.parentNode) n[ona] = null; 
        }, true);
        window[ona] = null;
        document[ona] = null;
        if (document.body) document.body[ona] = null; 
    }
    R("contextmenu");
    R("click");
    R("mousedown");
    R("mouseup");
    R("selectstart");
    R("keydoun");
    R("keyup");

    // select all html element and set "user-select" to "auto"
    document.querySelectorAll("*").forEach(e => {
        // get style of element (including css)
        const style = window.getComputedStyle(e);
        if(style.getPropertyValue("user-select") == "none"){
            e.style.userSelect = "auto";
        }
    });
}

// @navigation
export const navigation = (input) => {
    // const input = new URLSearchParams(window.location.search).get("href");
    console.log(input)
    const [_, prefix, number] = input.toLowerCase().match(/([a-z]?)([0-9]+)/) ?? [];

    const links = {
        "n": ["http://nhentai.net/g/", ""],
        // "n": ["http://nhentai.website/g/", ""],
        "w": ["https://www.wnacg.com/photos-index-aid-", ".html"],
        "p": ["https://www.pixiv.net/artworks/", ""],
    }

    const goto = linkName => {
        if(linkName in links){
            window.open(links[linkName].join(number), target="_blank");
        }
    }

    if(prefix in links) goto(prefix);
    else if(number){
        const numberValue = parseInt(number);
        if(number.length == 6) goto("n");
        else if(number.length == 5) goto("w");
        else if(1E7 < numberValue && numberValue < 1.3E8) goto("p");
    }
}

// @searchSaucenao
export const searchSaucenao = (imgUrl) => {
    document.getElementById("urlInput").value = imgUrl;
    document.getElementById("urlInput").dispatchEvent(new CustomEvent("blur"));
    document.getElementById("searchButton").click();
}

// @searchAscii2d
export const searchAscii2d = (imgUrl) => {
    document.getElementById("uri-form").value = imgUrl;
    document.getElementById("uri-form").parentElement.nextElementSibling.children[0].click();
}

// @getBahaImg
export const getBahaImg = (tab, actionType=1) => {
    var element = document.cElement;
    const imgUrls = [];
    const imgEls = [];

    const title = document.querySelector(".c-post__header__title").innerText;
    var article = [];
    // determine get all floors or only the clicked floor
    while(element){// c-article FM-P2
        if(element.classList.contains("c-article") && element.classList.contains("FM-P2")){
            article = [element];
            break;
        }
        element = element.parentElement;
    }
    if(!article.length) article = [...document.getElementsByClassName("c-article FM-P2")];

    // get baha every floor img
    article.forEach(
        e => [...e.getElementsByTagName("img")].forEach(
            imgEl => {
                imgUrls.push(imgEl.getAttribute("data-src"));
                imgEls.push(imgEl);
            }
        )
    );
    console.log(imgUrls);

    if(actionType & 1) navigator.clipboard?.writeText && navigator.clipboard.writeText(JSON.stringify(imgUrls));

    return {title, imgUrls};
}
// record the clicked element at bahamut
tabStore.domains["forum.gamer.com.tw"] = {
    script: (tab) => {
        if(!document.cElement) document.cElement = null;
        document.addEventListener("contextmenu", e => {
            document.cElement = document.elementFromPoint(e.x, e.y);
        })
    }
}

// export chatGPT as image
export const exportChatGPTConversation = () => {
    // div: @thread-xl/thread:pt-header-height mt-1.5 flex flex-col text-sm
    const allChat = [...document.querySelectorAll("div")].filter(x => x.classList.contains("@thread-xl/thread:pt-header-height"))[0];
    const title = document.querySelector("title").innerText;
    html2canvas(allChat, {
        backgroundColor: "#212121",
    }).then(function(canvas) {
        // trans canvas to image
        canvas.toBlob(function(blob) {
            const blobUrl = URL.createObjectURL(blob);
            const img = new Image();
            img.src = blobUrl;

            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = title;
            a.appendChild(img);

            // open img as new tab
            const w = window.open("");
            // write img to new tab
            w.document.write(a.outerHTML);
            // set title
            w.document.title = title;
        }, "image/png");
    });
}

// qrcode decoder
export const deQrcode = async () => {
    const image = document.clickedImage;

    fetch(image.src).then(async r => {
        const image2 = new Image();
        image2.src = URL.createObjectURL(await r.blob());
        // image2.crossOrigin = "Anonymous";
        image2.onload = () => {
            const qrcode = new QrcodeDecoder();
            qrcode.decodeFromImage(image2).then(result => {
                result.data && navigator.clipboard?.writeText && navigator.clipboard.writeText(result.data);
                const status = result.data ? "解析成功" : "解析失敗";
                Toast(3000).fire(status, result.data ?? "");
            });
        }
    }).catch(e => {
        Toast(1500).fire("error", "解析失敗 :(", e);
    });

    // image.crossOrigin = "Anonymous";
    // setTimeout(()=>{
    //     const qrcode = new QrcodeDecoder();
    //     // console.log(image, qrcode);
    //     try{
    //         qrcode.decodeFromImage(image).then(result => {
    //             // console.log(result);
    //             result.data && navigator.clipboard?.writeText && navigator.clipboard.writeText(result.data);
    //             const status = result.data ? "解析成功" : "解析失敗";
    //             Toast(3000).fire(status, result.data ?? "");
    //         });
    //     }
    //     catch(e){
    //         Toast(1500).fire("error", "解析失敗 :(", e);
    //     }
    // }, 50);
}

export const getPixivAllImg = async (info) => {
    // page url: https://www.pixiv.net/artworks/123793853
    // image url: https://i.pximg.net/img-original/img/2024/10/29/21/21/19/123793853_p0.jpg

    // title class: sc-a2ee6855-3 kQqnJS
    const title = document.querySelector(".sc-a2ee6855-3.kQqnJS").innerText;

    // get image url
    const imageNumber = info.frameUrl.split("/").pop();
    // get image number
    const imgUrls = [...document.querySelectorAll("a")].map(e => e.href).filter(e => e.includes(imageNumber)).filter(e => e.includes("i.pximg.net"));
    return {imgUrls, title};
}

tabStore.always.push({
    script: (tab) => {
        document.addEventListener("contextmenu", e => {
            const ele = document.elementFromPoint(e.x, e.y);
            if(ele instanceof Image) document.clickedImage = ele;
        })
    }
})