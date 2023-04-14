export const executeScript = async (target, file, ...args) => {
    var tabId;
    console.log("file", typeof file, file)
    // if target is "current", get current tab
    if (target == "current") {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });
        // if url is not start with "http", cancel
        if(!tab.url.match("^http")) return;
        // console.log("executeScript: ", tabId, tab);
        tabId = tab.id;
    }
    else tabId = target;

    // if file is string, execute file
    if(typeof file == "string"){
        return await chrome.scripting.executeScript({
            target: {
                tabId: tabId
            },
            files: [`js/${ file }`],
            // files: [`chrome-extension://${ chrome.runtime.id }/js/${ file }`],
        });
    }
    // if file is function, execute function
    else if(typeof file == "function"){
        return await chrome.scripting.executeScript({
            target: {
                tabId: tabId
            },
            func: file,
            args: args,
        });
    }
    // if file is an Array, check each item if all of them are string
    else if(Array.isArray(file)){
        return await chrome.scripting.executeScript({
            target: {
                tabId: tabId
            },
            files: file.filter(item => typeof item == "string"),
        });
    }
}

export const getDomain = (url) => {
    const domain = url.match(/^https?:\/\/([^\/]+)/);
    return domain ? domain[1] : "";
}

export const executeStoreScript = async (obj, key, tab) => {
    if(typeof obj[key].script == "function" || typeof obj[key].script == "string"){
        await executeScript(tab.id, obj[key].script, tab, ...(obj[key].args ?? []));
    }

    if(obj[key].delete) delete obj[key];
}