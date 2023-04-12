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
        if(number.length == 6) goto("n");
        else if(number.length == 5) goto("w");
        else if(number.length == 8) goto("p");
    }
}