// const imgUrl = new URLSearchParams(window.location.search).get("imageURL");

export const search_saucenao = (imgUrl) => {
    document.getElementById("urlInput").value = imgUrl;
    document.getElementById("urlInput").dispatchEvent(new CustomEvent("blur"));
    document.getElementById("searchButton").click();
}