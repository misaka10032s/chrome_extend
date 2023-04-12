console.log("reloading image");
[...document.getElementsByTagName("img")].forEach(e=>{if(e.width==16)e.src=e.src;})