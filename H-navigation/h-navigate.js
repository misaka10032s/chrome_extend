chrome.contextMenus.create({
    id: "text",
    type: "normal",
    title: "Search: %s",
    contexts: ["selection"],
});

chrome.contextMenus.create({
    id: "navigate",
    type: "normal",
    title: "goto: %s",
    contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener(
    (info, tab) => {
        switch(info.menuItemId){
            case "text":
                console.log("info, tab ", info, tab);
                console.log("Word " + info.selectionText + " was clicked.");
                chrome.tabs.create({
                    url: "http://www.google.com/search?q=" + info.selectionText
                });
                break;
            case "navigate":
                console.log("info, tab ", info, tab);
        }
        
});
