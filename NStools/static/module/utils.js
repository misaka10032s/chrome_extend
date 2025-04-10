

// download mulpiple images
export const downloadMultipleImgs = async (tab, title, urls, delay=200) => {
    for(let index = 0; index < urls.length; index++){
        const url = urls[index];
        if(!url) continue;

        console.log(url, index);

        const imageExtension = url.split(".").pop();
        
        try{
            // because maximum 10 download at the same time, so set a delay to prevent overflow
            await new Promise(resolve => setTimeout(resolve, delay));
            
            await fetch(url).then(async r => {
                const blobUrl = URL.createObjectURL(await r.blob());
                console.log(blobUrl);

                const anchor = document.createElement("a");
                anchor.href = blobUrl;
                anchor.download = `${title}-${index}.${imageExtension}`;
                document.body.appendChild(anchor);

                anchor.click();

                URL.revokeObjectURL(blobUrl);
                document.body.removeChild(anchor);
            });
        }
        catch(e){
            console.error(e);
            Toast(1500).fire("error", "下載失敗 :(", e);
        }
    };
    await new Promise(resolve => setTimeout(resolve, 500));
}