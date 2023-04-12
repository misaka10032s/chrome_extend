// const imgUrl = new URLSearchParams(window.location.search).get("imageURL");

export const search_ascii2d = (imgUrl) => {
    document.getElementById("uri-form").value = imgUrl;
    document.getElementById("uri-form").parentElement.nextElementSibling.children[0].click();
}