import { tabStore } from "./store.js";
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
}

// @navigation
export const navigation = (input) => {
    // const input = new URLSearchParams(window.location.search).get("href");
    console.log(input)
    const [_, prefix, number] = input.toLowerCase().match(/([a-z]?)([0-9]+)/) ?? [];

    const links = {
        "n": ["http://nhentai.net/g/", ""],
        "w": ["https://www.wnacg.org/photos-index-aid-", ".html"],
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
export const getBahaImg = (tab) => {
    var element = document.cElement;
    const urls = [];

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
            e2 => urls.push(e2.getAttribute("data-src"))
        )
    );
    console.log(urls);
    navigator.clipboard?.writeText && navigator.clipboard.writeText(JSON.stringify(urls));
    return urls;
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

// qrcode decoder
export const deQrcode = async () => {
    const image = document.clickedImage;
    image.crossOrigin = "Anonymous";
    setTimeout(()=>{
        const qrcode = new QrcodeDecoder();
        // console.log(image, qrcode);
        try{
            qrcode.decodeFromImage(image).then(result => {
                // console.log(result);
                result.data && navigator.clipboard?.writeText && navigator.clipboard.writeText(result.data);
                Toast.fire("success", result.data ?? "No data found");
            });
        }
        catch{
            Toast.fire("error", "Decode failed");
        }
    }, 50);

    // const imageBlob = await fetch(image.src).then(response => response.blob());
    // const reader = new FileReader();
    // reader.readAsDataURL(imageBlob);
    // reader.onloadend = () => {
    //     const base64EncodedImage = reader.result.split(',')[1];
    //     const img = document.createElement('img');
    //     img.src = 'data:image/jpeg;base64,' + base64EncodedImage;
    //     img.crossOrigin = "Anonymous"
    //     // document.body.appendChild(img);

    //     const qrcode = new QrcodeDecoder();
    //     // console.log(img, qrcode);
    //     try{
    //         qrcode.decodeFromImage(image).then(result => {
    //             console.log(result);
    //             result.data && navigator.clipboard?.writeText && navigator.clipboard.writeText(result.data);
    //             Toast.fire("success data:", result.data ?? "No data found");
    //         });
    //     }
    //     catch{
    //         Toast.fire("error", "Decode failed");
    //     }
    // }
}

tabStore.always.push({
    script: "QrcodeDecoder.js"
}, {
    script: (tab) => {
        document.addEventListener("contextmenu", e => {
            const ele = document.elementFromPoint(e.x, e.y);
            if(ele instanceof Image) document.clickedImage = ele;
        })
    }
})