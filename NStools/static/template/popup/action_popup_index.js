const hi = document.getElementById("hi");
const message = document.getElementById("message");

const imgUrl = new URLSearchParams(window.location.search).get("imageURL");

document.addEventListener("click", async e => {
    var tab = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.tabs.sendMessage(tab[0].id, {greeting: "你好"}).then(response => {
        console.log(response);
    });
});