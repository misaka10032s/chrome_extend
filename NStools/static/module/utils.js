

export const useUtils = (init = false) => {
    // download mulpiple images
    const downloadMultipleImgs = async (tab, title, urls, delay=200) => {
        for(let index = 0; index < urls.length; index++){
            const url = urls[index];
            if(!url) continue;

            const imageExtension = url.split(".").pop();
            
            try{
                // because maximum 10 download at the same time, so set a delay to prevent overflow
                await new Promise(resolve => setTimeout(resolve, delay));
                
                await fetch(url).then(async r => {
                    const blobUrl = URL.createObjectURL(await r.blob());

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

    // transform image to blob object
    const image2Blob = async (image) => {
        if(!image) return;
        const imgUrl = typeof image === "string" ? image : image.src;

        const res = await fetch(imgUrl, {mode: "cors"});
        if(!res.ok) return;
        return await res.blob();
    }

    // transform image to canvas
    // image: image element or image url
    const image2Canvas = async (image) => {
        const blob = await image2Blob(image);
        if(!blob) return;

        // Convert the image blob to image using a canvas
        const imageBitmap = await createImageBitmap(blob);
        const canvas = document.createElement("canvas");
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(imageBitmap, 0, 0);

        return canvas;
    }

    // transform image to base64
    // image: image element or image url
    const image2Base64 = async (image) => {
        const blob = await image2Blob(image);
        if(!blob) return;

        // Create a FileReader to convert the blob to a Base64 string
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // Base64 string will be here
            reader.onerror = () => reject("Error reading the Blob as Base64");
            reader.readAsDataURL(blob);
        });
        Toast(1500).fire("success", base64);
        return base64;
    }

    // copy image to clipboard
    const copyImageToClipboard = async (image, type="png") => {
        const imageCanvas = await image2Canvas(image);
        if(!imageCanvas) return;
        try {
            const pngBlob = await new Promise(resolve => imageCanvas.toBlob(resolve, `image/${ type }`));

            // Create a ClipboardItem with the PNG blob
            const clipboardItem = new ClipboardItem({ [`image/${ type }`]: pngBlob });

            // Write the ClipboardItem to the clipboard
            await navigator.clipboard.write([clipboardItem]);

            // console.log("Image copied to clipboard successfully!");
            Toast(1500).fire("success", "圖片已複製到剪貼簿 :)");
        } catch (error) {
            // console.error("Error copying image to clipboard:", error);
            Toast(1500).fire("error", "複製失敗 :(", error);
        }
    }

    // copy text to clipboard
    const copyTextToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            // console.log("Text copied to clipboard successfully!");
            Toast(1500).fire("success", "文字已複製到剪貼簿 :)");
        } catch (error) {
            // console.error("Error copying text to clipboard:", error);
            Toast(1500).fire("error", "複製失敗 :(", error);
        }
    }

    // dispatch paste event
    const pasteImage = async (target, type="png") => {
        if (!target) target=document;
        else if(typeof target === "string") target = document.querySelector(target);

        if(!target) return;

        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
            if (item.types.includes(`image/${ type }`)) {
                const blob = await item.getType(`image/${ type }`); // Prefer PNG if available

                // make sure pasteEvent.clipboardData.files[0] is a blob
                const file = new File([blob], `image.${ type }`, { type: `image/${ type }` });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                const pasteEvent = new ClipboardEvent('paste', {
                    bubbles: true,
                    cancelable: true,
                    clipboardData: dataTransfer
                });
                target.dispatchEvent(pasteEvent);

                console.log("Image pasted from clipboard successfully!");
                return;
            }
        }
    }

    const data = {
        downloadMultipleImgs,
        image2Blob,
        image2Canvas,
        image2Base64,
        copyImageToClipboard,
        copyTextToClipboard,
        pasteImage
    };

    if(init) {
        // init all utils
        for (const key in data) {
            window[key] = data[key];
        }
    }

    return data
}