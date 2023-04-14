class supfnc{
    // get the cookie value by name
    static getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    // get query string from url
    static getUrlQuery = (name) => {
        return new URL(window.location.href).searchParams.get(name)
    }

    // text is a string, macro is a dictinary object, key and value are string
    // parse a string to json, replace keys in macro to value, just like python's dict(text, **macro)
    // text = `{'foo': 'bar'}` will replace all {"foo" to "bar"}, but {"fo\'o": "bar"} will not be replaced to {"fo\"o": "bar"}
    // it means the single quote in the key or value will not be replaced to double quote
    // if macro = {foo: "bar"}, then all "foo" in text will be replaced to "bar"
    static toJSON = (text, macro) => {
        try{
            text = text.replace(new RegExp(macro, 'g'),"");
            return JSON.parse(text.replace(/\&amp;/g, "&").replace(/\&\#39;/g, "\""));
        }
        catch(e){
            try{
                var ch = {}, tmp; // /(?<=[^\\])\"(\\\"|[^\"])*\'+(\\\"|[^\"])*\"(?=[^\\])/g
                text = text.replace(new RegExp("(?<=[^\\\\])\"(\\\"|[^\"])*\'+(\\\"|[^\"])*\"(?=[^\\\\])", 'g'), (x) => {
                    tmp = "@"+this.randAlphabet(10);
                    ch[tmp] = x;
                    return tmp;
                }); // /(?<=(([:,{]|[^\\])\s*))\'|(?<=[^\\])\'(?=(\s*([:,}])))/g
                text = text.replace(new RegExp("(?<=(([:,{]|[^\\\\])\\s*))\'|(?<=[^\\\\])\'(?=(\\s*([:,}])))", 'g'), "\"");
                for(var i in ch){
                    text = text.replace(i, ch[i]);
                }
                return JSON.parse(text.replace(new RegExp("\\&amp;", 'g'), "&").replace(new RegExp("\\&\\#39;", 'g'), "\""));
            }
            catch(e){
                console.log(text, e);
                return {};
            }
        }
    }

    // remove all illegal characters in str
    static remove_illiegalChar = (str) => {
        if (typeof str != "string") return "";
        return str.replace(new RegExp("[\\\\/:*?\"\'<>|\\n\\b\\0\\t]", "g"), "");
    }

    //parse UTC time to Taiwan time with format "民國xx年xx月xx日"
    static taiwanTime = (time) => {
        if(!time) time = new Date(Date.now() + 8*3600*1000).toISOString();
        var t = time.split("-");
        return "民國" + (t[0]>1000? t[0]-1911:t[0]) + "年" + t[1] + "月" + t[2].slice(0,2) + "日";
    }

    // return relative time string from now with format "xx分鐘前"
    static getRelativeTime = (dateStr) => {
        if(isNaN(Date.parse(dateStr))) return "時間格式錯誤 yyyy-mm-dd (hh:mm:ss)";
        var D_dateValue = (Date.now()-Date.parse(dateStr))/1000, timeGap = [1, 60, 3600, 86400, 604800, 18144000, 220752000], unit=["秒", "分", "小時", "天", "周", "個月", "年"];
        for(var i=0;i<6;i++){
            if(D_dateValue / timeGap[i+1] < 1){
                return parseInt(D_dateValue / timeGap[i]) + unit[i] + "前";
            }
        }
    }

    // get how many days in a month, input value is a Date object
    static getMonthDays(m = new Date()){
        return new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    }

    // copy innerText of an element to clipboard
    static clickCopy = (el) => {
        try{
            navigator.clipboard?.writeText && navigator.clipboard.writeText(el.innerText);
        }
        catch{
            var range = document.createRange();
            range.selectNode(el);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand("copy");
            window.getSelection().removeAllRanges();
        }
    }

    // scroll to top, bottom, start, end of an element
    static scrollToTop = (el = document.body) => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    static scrollToBottom = (el = document.body) => {
        el.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    static scrollToStart = (el = document.body) => {
        el.scrollIntoView({ behavior: "smooth", inline: "start" });
    }

    static scrollToEnd = (el = document.body) => {
        el.scrollIntoView({ behavior: "smooth", inline: "end" });
    }

    // get z-index of an element
    static getZindex = (el = document.body) => {
        if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null).getPropertyValue("z-index");
        }
        else if (el.currentStyle) {
            return el.currentStyle["z-index"];
        }
    }

    // return a string with length n, contains random alphabet and number
    static randAlphabet = (n) => {
        var t = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789", r="";
        for(var i=0;i<n;i++){
            r+=t[parseInt(Math.random() * (52 + i ? 10 : 0))];
        }
        return r;
    }

    // return the type of an object
    static getObjType(obj){
        if(typeof obj != "object") return typeof obj;
        if(Array.isArray(obj)) return "array";
        if(obj == null) return "null";
        return typeof obj;
    }

    // check if target is a child of parent
    static isParentElement(target, parent){
        while(target){
            if(target == parent) return 1;
            target = target.parentElement;
        }
        return 0;
    }

    // create an element with options
    // options contains class, style, attr, id
    static createElement(tagName, options){
        var el = document.createElement(tagName), tmp;
        for(var i in options){
            if(!options[i]) continue;
            if(i == "class"){
                tmp = [];
                if(typeof options.class == "string") tmp = options.class.split(" ");
                else if(Array.isArray(options.class)) tmp = options.class;
                for(var j in tmp) el.classList.add(tmp[j]);
            }
            else if(i == "style"){
                for(var j in options.style){
                    el.style[j] = options.style[j];
                }
            }
            else if(i == "attr"){
                for(var j in options.attr){
                    el.setAttribute(j, options.attr[j]);
                }
            }
            else if(i == "id"){
                el.id = options.id;
            }
        }
        return el;
    }

    // create NS element with options, similar to createElement method
    static createElementNS(tagName, options){
        var el = document.createElementNS("http://www.w3.org/2000/svg", tagName), tmp;
        for(var i in options){
            if(!options[i]) continue;
            if(i == "class"){
                tmp = [];
                if(typeof options.class == "string") tmp = options.class.split(" ");
                else if(Array.isArray(options.class)) tmp = options.class;
                for(var j in tmp) el.classList.add(tmp[j]);
            }
            else if(i == "style"){
                for(var j in options.style){
                    el.style[j] = options.style[j];
                }
            }
            else if(i == "attr"){
                for(var j in options.attr){
                    el.setAttribute(j, options.attr[j]);
                }
            }
            else if(i == "id"){
                el.id = options.id;
            }
        }
        return el;
    }

    // bind events to elements
    // element is a HTML element, eventsFnc is an object contains functions
    // ...argw is arguments for functions
    static bindEvent(element, eventsFnc, ...argw){
        if(!element) return;
        var chr = [...element.getElementsByTagName('*') || []], events, fncName;
        chr.push(element);
        for(let c in chr){ // loop
            events = chr[c].getAttributeNames().reduce((a,e)=>{if(e[0]=='@')a.push(e); return a;}, []);
            for(let fncIdx in events){
                fncName = chr[c].getAttribute(events[fncIdx]);
                if(typeof eventsFnc[fncName] != "function") continue;
                chr[c].addEventListener(events[fncIdx].slice(1), (e)=>{
                    eventsFnc[fncName](e, ...argw);
                });
                chr[c].removeAttribute(events[fncIdx]);
            }
        }
    }

    // return a formatted date string by yyyy-mm-dd hh:mm:ss
    static dateFormat = (dateStr, option) => {
        dateStr = dateStr ? dateStr.splice(4,0,'-').splice(7,0,'-').splice(10,0,':').splice(13,0,':').splice(16,0,':') : "";
        switch(option){
            case "distance":
                var dateValue = Date.parse(dateStr);
                return Date.now()-dateValue;
            case "flex":
                var D_dateValue = (Date.now()-Date.parse(dateStr))/1000, timeGap = [1, 60, 3600, 86400, 604800, 18144000, 220752000], unit=["秒", "分", "小時", "天", "周", "月", "年"];
                for(var i=0;i<6;i++){
                    if(D_dateValue / timeGap[i+1] < 1){
                        return parseInt(D_dateValue / timeGap[i]) + unit[i] + "前";
                    }
                }
                return;
            case "year":
                return dateStr.slice(0,4);
                
            case "month":
                return dateStr.slice(0,7);
                
            case "day":
                return dateStr.slice(0,10);
                
            case "hour":
                return dateStr.slice(0,13);
                
            case "minute":
                return dateStr.slice(0,16);
                
            case "second":
                return dateStr
                
            case "getMonth":
                return dateStr.slice(5,7);
                
            case "getDay":
                return dateStr.slice(8,10);
                
            case "getHour":
                return dateStr.slice(11,13);
                
            case "getMinute":
                return dateStr.slice(14,16);
                
            case "getSecond":
                return dateStr.slice(17);
        }
    }

    // canvas is the canvas to be downloaded
    // duration is the duration of the video
    // audioBitsPerSecond is the audio bitrate
    // videoBitsPerSecond is the video bitrate
    // mimeType is the type of the video
    static downloadCanvas(canvas, duration = 5000, audioBitsPerSecond = 128000, videoBitsPerSecond = 4800000, mimeType="video/mp4"){
        startRecording();

        function startRecording() {
            const options = {
                audioBitsPerSecond: audioBitsPerSecond,
                videoBitsPerSecond: videoBitsPerSecond,
                mimeType: mimeType, // "video/mp4",
            };
            const chunks = []; // here we will store our recorded media chunks (Blobs)
            const stream = canvas.captureStream(); // grab our canvas MediaStream
            const rec = new MediaRecorder(stream, options); // init the recorder
            // every time the recorder has new data, we will store it in our array
            rec.ondataavailable = e => chunks.push(e.data);
            // only when the recorder stops, we construct a complete Blob from all the chunks
            rec.onstop = e => exportVid(new Blob(chunks, {type: 'video/webm'}));
            
            rec.start();
            setTimeout(()=>rec.stop(), duration); // stop recording in 3s
        }

        function exportVid(blob) {
            const vid = document.createElement('video');
            vid.src = URL.createObjectURL(blob);
            vid.controls = true;
            document.body.appendChild(vid);
            const a = document.createElement('a');
            a.download = 'myvid.webm';
            a.href = vid.src;
            a.textContent = 'download the video';
            document.body.appendChild(a);
            a.click();

            vid.remove();
            a.remove();
        }
    }

    // get the element at the position (x, y)
    static getClickedElement = (x, y) => {
        return document.elementFromPoint(x, y);
    }

    // get a random color, alpha is whether to include alpha channel
    static randomColor = (alpha=false) => {
        return "#" + Array.from({length: alpha?8:6}, (_, i) => i).reduce((a) => {a += Math.floor(Math.random() * 16).toString(16);return a;}, "").toUpperCase();
    };
    
    // compare two objects if they are equal
    static isEqual = (a,b) => {
        if(typeof a != typeof b) return 0;
        if(typeof a == "object"){
            if(Object.keys(a).length != Object.keys(b).length) return 0;
            for(var i in a){
                if(!this.isEqual(a[i], b[i])) return 0;
            }
            return 1;
        }
        else return a == b;
    }

    // console.log(supfnc.arrayFromTo([0,1,2,3], [0,1,3,4])); // add [4] del [2]
    // console.log(supfnc.arrayFromTo([0,1,2,3], [0,1,4,5,3])); // add [4,5] del [2]
    // console.log(supfnc.arrayFromTo([0,1,2,3], [0,1,3])); // add [] del [2]
    // console.log(supfnc.arrayFromTo([0,1,2,3], [0,1,4,5,2,3])); // add [4,5] del []
    // console.log(supfnc.arrayFromTo([0,1,2,3,4,5,6,7,8,9,10], [0,1,6,5,4,8,10])); // add [6,5] del [2,3,5,6,7,9]
    // console.log(supfnc.arrayFromTo([0,1,2,3,4,5,6,7,8,9,10], [0,1,4,11,6,8,12,10])); // add [11,12] del [2,3,5,7,9]
    
    // get the difference between two arrays
    // return {add: Array, del: Array, addIdx: Array, delIdx: Array}
    // add: the elements value to be added
    // del: the elements value to be deleted
    // addIdx: the elements index to be added
    // delIdx: the elements index to be deleted
    // delete elements in order first, then add elements

    static arrayFromTo = (origArr, distArr) =>{
        var r = {add:[], del:[], addIdx:[], delIdx:[]}, origEx = [], tmpArr = [], tmpL, tmpIdx = 0, ref, refArrMax, refArrMaxIdx = 0, refArrMaxL = 0;
        ref = this.LCS(origArr, distArr);
        // console.log("arrayFromToB", origArr, origArr, ref);
        
        if(ref.length > 0){
            for(var i in origArr){
                if(this.isEqual(origArr[i], distArr[i])) tmpArr.push(origArr[i]);
            }
            for(var i in ref) {
                refArrMax = this.LCS(ref[i], tmpArr);
                if(refArrMax.length){
                    tmpL = refArrMax[0].length;
                    if(tmpL > refArrMaxL){
                        refArrMaxL = tmpL;
                        refArrMaxIdx = i;
                    }
                }
            }
            ref = ref[refArrMaxIdx];
            for(let i in origArr){
                if(!this.isEqual(origArr[i], ref[tmpIdx])){
                    r.del.push(origArr[i]);
                    r.delIdx.push(parseInt(i));
                    // origEx.push(origArr[i]);
                }
                else{
                    origEx.push(ref[tmpIdx]);
                    tmpIdx++;
                }
            }
            tmpIdx = 0;
            for(var i in distArr){
                if(!this.isEqual(distArr[i], origEx[tmpIdx])){
                    r.add.push(distArr[i]);
                    r.addIdx.push(parseInt(i));
                }
                else{
                    tmpIdx++;
                }
            }

            r.del.reverse();
            r.delIdx.reverse();
            return r;
        }
        else{
            for(var i in origArr){
                r.del.push(origArr[i]);
                r.delIdx.push(parseInt(i));
            }
            for(var i in distArr){
                r.add.push(distArr[i]);
                r.addIdx.push(parseInt(i));
            }
            r.del.reverse();
            r.delIdx.reverse();
            return r;
        }
    }
    
    // similar to arrayFromTo, but movIdx 
    // first delete all elements
    // then move elements
    // finally add elements
    // each operation should be done in order
    static arrayFromToB = (origArr, distArr) =>{
        var r = {add:[], del:[], addIdx:[], delIdx:[], movIdx: []}, origDict = {}, distDict = {};
        
        for(var i in origArr){
            for(var j in distArr){
                if(this.isEqual(origArr[i], distArr[j]) && !(i in origDict) && !(j in distDict)){
                    origDict[i] = 1;
                    distDict[j] = 1;
                    r.movIdx.push([parseInt(i), parseInt(j)]);
                    break;
                }
            }
        }
        for(var i in origArr){
            if(!(i in origDict)){
                r.del.push(origArr[i]);
                r.delIdx.push(parseInt(i));
            }
        }
        for(var i in distArr){
            if(!(i in distDict)){
                r.add.push(distArr[i]);
                r.addIdx.push(parseInt(i));
            }
        }

        r.del.reverse();
        r.delIdx.reverse();

        for(var i in r.movIdx){
            for(var j in r.delIdx){
                if(r.delIdx[j] < r.movIdx[i][0]) r.movIdx[i][0]--;
            }
        }
        for(var i=0; i<r.movIdx.length; i++){
            for(var j=0; j<i; j++){
                if(r.movIdx[i][0] == r.movIdx[j][1]){
                    r.movIdx[i][0] = r.movIdx[j][0];
                }
            }
        }
        for(var i=0; i<r.movIdx.length; i++){
            if(r.movIdx[i][1] == r.movIdx[i][0]){
                r.movIdx.splice(i, 1);
                i--;
                continue;
            }
            if(r.movIdx[i][1] < r.movIdx[i][0]) {
                var tmp = r.movIdx[i][1];
                r.movIdx[i][1] = r.movIdx[i][0];
                r.movIdx[i][0] = tmp;
            }
        }
        return r;
    }

    // 最長共同子序列 (Longest Common Subsequence; LCS)
    // ex: LCS([1,2,3,4,5], [1,3,4,5,6]) => [1,3,4,5]
    static LCS = (arr1, arr2) => {
        if(!Array.isArray(arr1) || !Array.isArray(arr2)) return [];

        var mapping = (p, q) => {
            var m = [];
            for (var i = 0; i <= p.length; i++){
                m[i] = [];
                m[i][0] = 0;
            }
            for (var i = 0; i <= q.length; i++) m[0][i] = 0;
            for (var i = 0; i < p.length; ++i){
                for (var j = 0; j < q.length; ++j){
                    m[i+1][j+1] = this.isEqual(p[i], q[j]) ? m[i][j] + 1 : Math.max(m[i+1][j], m[i][j+1]);
                }
            }
            return m;
        };
        var map = mapping(arr1, arr2), maxL = map[arr1.length][arr2.length], route = {}, rtn = [];
        for(var i=arr1.length; i>=0; i--){
            for(var j=arr2.length; j>=0; j--){
                if(map[i][j-1] == map[i][j]-1 && map[i-1][j] == map[i][j]-1){
                    if(!route[map[i][j]]) route[map[i][j]] = [[i, j]];
                    else route[map[i][j]].push([i, j]);
                }
            }
        }

        var findAll = (point = maxL, lst = []) => {
            var tmp, l, idx;
            if(!lst.length){
                for(var i in route[point]){
                    lst.push({v: [arr1[route[point][i][0]-1]], x: route[point][i][0], y: route[point][i][1]})
                }
            }
            else{
                l = idx = lst.length;
                for(var i=0; i<l; i++){
                    tmp = [];
                    for(var j in route[point]){
                        if(lst[i].x > route[point][j][0] && lst[i].y > route[point][j][1]){
                            tmp.push(j);
                        }
                    }
                    for(var j=0; j<tmp.length-1; j++){
                        lst.push({v:lst[i].v.slice(), x:lst[i].x, y:lst[i].y});
                    }
                    for(var j=0; j<tmp.length; j++){
                        if(!j){
                            lst[i].v.push(arr1[route[point][tmp[j]][0]-1]);
                            // lst[i].v += arr1[route[point][tmp[j]][0]-1];
                            lst[i].x = route[point][tmp[j]][0];
                            lst[i].y = route[point][tmp[j]][1];
                        }
                        else{
                            lst[idx].v.push(arr1[route[point][tmp[j]][0]-1]);
                            // lst[idx].v += arr1[route[point][tmp[j]][0]-1];
                            lst[idx].x = route[point][tmp[j]][0];
                            lst[idx].y = route[point][tmp[j]][1];
                            idx++;
                        }
                    }
                }
            }
            if(point > 0) findAll(point - 1, lst);
            return lst;
        }
        var res = findAll();
        for(var i in res){
            res[i] = res[i].v.reverse();
        }
        
        return res;
    }

    // console.log(supfnc.LCS([0,1,2,3], [0,1,3,4])); // ['0,1,3']
    // console.log(supfnc.LCS([0,1,2,3], [0,1,4,5,3])); // ['0,1,3']
    // console.log(supfnc.LCS([0,1,2,3], [3,2,1,0])); // ['0','1','2','3']
    // console.log(supfnc.LCS([0,1,2,3,4,5,6,7,8,9,10], [0,1,6,5,4,8,10])); // ['0,1,4,8,10', '0,1,5,8,10', '0,1,6,8,10']
    // console.log(supfnc.LCS([0,1,2,3,4,5,6,7,8,9,10], [0,1,4,11,6,8,12,10,9])); // ['0,1,4,6,8,9', '0,1,4,6,8,10']
    // console.log(supfnc.LCS([0,1,2,3,4,5,6], [0,8,3,7,6,5,2])); // ['0,3,5', '0,3,6']

    // return how many 1 in n in binary
    static oneNumBinary = (n) => {
        if(typeof n == "number"){
            var r = 0, x = 1;
            while(x <= n){
                if(x & n) r++;
                x *= 2;
            }
            return r;
        }
        return -1;
    }

    // return the number first not zero bit in binary
    static lowbit = (x) => {
        return x&-x;
    }

    // factorization a number
    static factor = (n) => { // factorization
        if(typeof n == "number"){
            var w = [], g = Math.sqrt(n);
            while(n > 1){
                if(!(n%2)) {
                    w.push(2);
                    n /= 2;
                    g = Math.sqrt(n);
                    continue;
                }
                for(var i=3; i<=g; i+=2){
                    if(!(n%i)){
                        w.push(i);
                        n /= i;
                        g = Math.sqrt(n);
                        break;
                    }
                }
                if(i>g){
                    w.push(n);
                    n = g = 1;
                }
            }
            return w;
        }
        return [];
    }

    // links is vertex, syntax: [[from, to, cost], ...]
    // minist spanning tree Prim's algorithm
    static MST_P = (links, directional = 0) => {
        // directional 無向 = 0, 有向 = 1
        // links = [[from, to, cost], ...]
        var nowVertex;
        let vertexStatus = {}, vertexTo = {}, vertexToSorted = {}, tree = [];
        var vertexNumAdded = 0, vertexNum = 0;

        var st, ed, cost;
        for(var i in links){
            st = links[i][0];
            ed = links[i][1];
            cost = links[i][2];
            for(var j=0; j<(directional?1:2); j++){
                if(!(st in vertexStatus)){
                    vertexTo[st] = {};
                    vertexStatus[st] = [null, Infinity, 0];
                    vertexNum++;
                }
                if(vertexTo[st][ed]) vertexTo[st][ed] = Math.min(vertexTo[st][ed], cost);
                else vertexTo[st][ed] = cost;

                [st, ed] = [ed, st];
            }
        }

        var routeTmp;
        for(var i in vertexTo){
            routeTmp = [];
            for(j in vertexTo[i]){
                routeTmp.push([j, vertexTo[i][j]]);
            }
            vertexToSorted[i] = routeTmp.sort((a,b) => {return a[1]<b[1]?1:-1});
        }

        nowVertex = Object.keys(vertexStatus)[0];
        vertexStatus[nowVertex][2] = 1;
        tree.push(nowVertex);
        vertexNumAdded++;

        var minV, minOrig, minDest, tmp;
        while(vertexNumAdded < vertexNum){
            minV = Infinity;
            for(var i=0; i<vertexNumAdded; i++){
                tmp = vertexToSorted[tree[i]].slice(-1)[0];
                
                if(!tmp) continue;
                if(vertexStatus[tmp[0]][2]) {
                    vertexToSorted[tree[i]].pop();
                    i--;
                    continue;
                }
                if(tmp[1] < minV){
                    minV = tmp[1];
                    minOrig = tree[i];
                    minDest = tmp[0];
                }
            }
            vertexStatus[minDest][0] = minOrig;
            vertexStatus[minDest][1] = minV;
            vertexStatus[minDest][2] = 1;
            vertexToSorted[minOrig].pop();
            tree.push(minDest);
            vertexNumAdded++;
        }
        return vertexStatus;
    }

    // minist spanning tree Prim's algorithm another
    static MST_P2 = (links, directional = 0) => {
        // directional 無向 = 0, 有向 = 1
        // links = [[from, to, cost], ...]
        var nowVertex;
        var vertexStatus = {}, vertexTo = {}, tree = [], edges = [];
        var vertexNumAdded = 0, vertexNum = 0, edgeIdx = 0;

        var st, ed, cost;
        for(var i in links){
            st = links[i][0];
            ed = links[i][1];
            cost = links[i][2];
            for(var j=0; j<(directional?1:2); j++){
                if(!(st in vertexStatus)){
                    vertexTo[st] = {};
                    vertexStatus[st] = [null, Infinity, 0];
                    vertexNum++;
                }
                if(vertexTo[st][ed]) vertexTo[st][ed] = Math.min(vertexTo[st][ed], cost);
                else vertexTo[st][ed] = cost;

                [st, ed] = [ed, st];
            }
        }

        var setMinEdge = (vertex) => {
            var costTmp, nowMin;
            for(var i in vertexTo[vertex]){
                if(vertexStatus[i][2]) continue;
                costTmp = vertexTo[vertex][i];

                if(costTmp < vertexStatus[i][1]){
                    if(vertexStatus[i][1] == Infinity) edges.push(i);
                    
                    vertexStatus[i][0] = vertex;
                    vertexStatus[i][1] = costTmp;
                }
            }
            
            var eL = edges.length;
            
            nowMin = vertexStatus[edges.slice(-1)[0]][1];
            for(var i=edgeIdx; i<eL; i++){
                if(edges[i] === null || vertexStatus[edges[i]][2]){
                    edges[i] = null;
                    [edges[i], edges[edgeIdx]] = [edges[edgeIdx], edges[i]];
                    edgeIdx++;
                    continue;
                }
                if(vertexStatus[edges[i]][1] < nowMin){
                    nowMin = vertexStatus[edges[i]][1];
                    [edges[i], edges[eL-1]] = [edges[eL-1], edges[i]];
                }
            }
        }

        nowVertex = Object.keys(vertexStatus)[0];
        vertexStatus[nowVertex][1] = -Infinity;
        vertexStatus[nowVertex][2] = 1;
        
        var minV, minDest, minOrig, tmpEdge;
        while(vertexNumAdded < vertexNum - 1){
            setMinEdge(nowVertex);
            do{
                tmpEdge = edges.pop();
                minDest = tmpEdge;
                minOrig = vertexStatus[tmpEdge][0];
                minV = vertexStatus[tmpEdge][1];
            }
            while(!tmpEdge || vertexStatus[tmpEdge][2]);
            vertexStatus[minDest][2] = 1;
            tree.push([minOrig, minDest, minV]);
            vertexNumAdded++;
            nowVertex = minDest;
        }

        return tree;
    }

    // minist spanning tree Prim's algorithm another 2
    static MST_P3 = (links, directional = 0) => {
        // directional 無向 = 0, 有向 = 1
        // links = [[from, to, cost], ...]
        var nowVertex;
        var vertexStatus = {}, vertexTo = {}, tree = [];
        var vertexNumAdded = 0, vertexNum = 0;
        // var minHeap = new heap("min");
        var minHeap = new SMMH();

        var st, ed, cost;
        for(var i in links){
            st = links[i][0];
            ed = links[i][1];
            cost = links[i][2];
            for(var j=0; j<(directional?1:2); j++){
                if(!(st in vertexStatus)){
                    vertexTo[st] = {};
                    vertexStatus[st] = [null, Infinity, 0];
                    vertexNum++;
                }
                if(vertexTo[st][ed]) vertexTo[st][ed] = Math.min(vertexTo[st][ed], cost);
                else vertexTo[st][ed] = cost;

                [st, ed] = [ed, st];
            }
        }

        var setMinEdge = (vertex) => {
            var costTmp;
            for(var i in vertexTo[vertex]){
                if(vertexStatus[i][2]) continue;
                costTmp = vertexTo[vertex][i];

                if(costTmp < vertexStatus[i][1]){
                    minHeap.insert(i, costTmp);
                    vertexStatus[i][0] = vertex;
                    vertexStatus[i][1] = costTmp;
                }
            }
        }

        nowVertex = Object.keys(vertexStatus)[0];
        vertexStatus[nowVertex][1] = -Infinity;
        vertexStatus[nowVertex][2] = 1;
        
        var minV, minDest, minOrig, tmpEdge;
        while(vertexNumAdded < vertexNum - 1){
            setMinEdge(nowVertex);
            do{
                // tmpEdge = minHeap.pop()[0];
                tmpEdge = minHeap.popMin()[0];
            }
            while(vertexStatus[tmpEdge][2])
            
            minDest = tmpEdge;
            minOrig = vertexStatus[tmpEdge][0];
            minV = vertexStatus[tmpEdge][1];
            
            vertexStatus[minDest][2] = 1;
            tree.push([minOrig, minDest, minV]);
            vertexNumAdded++;
            nowVertex = minDest;
        }

        return tree;
    }

    // minist spanning tree Kruskal's algorithm
    static MST_K = (links) => {
        var vertexStatus = {}, vertexGroup = {}, tree = []//, links = linksRaw.slice();
        var vertexNum = 0, vertexAddedNum = 0;
        var checkingEdge;

        var vertexTmp;
        for(var i in links){
            for(var j=0; j<2; j++){
                vertexTmp = links[i][j];
                if(!(vertexTmp in vertexStatus)){
                    vertexStatus[vertexTmp] = -1; // what group it belongs
                    vertexNum++;
                }
            }
        }

        links.sort((a,b) => {return a[2]<b[2]?1:-1});

        var getGroupKey = () => {
            for(var i=0; i<vertexNum; i++){
                if(!(i in vertexGroup)){
                    return i;
                }
            }
        }

        var groupKeyTmp;
        while(links.length && (vertexNum-vertexAddedNum)){
            checkingEdge = links.pop();
            if(checkingEdge[0] == checkingEdge[1]) continue;
            
            if(vertexStatus[checkingEdge[0]] == -1 && vertexStatus[checkingEdge[1]] == -1){
                groupKeyTmp = getGroupKey();
                vertexStatus[checkingEdge[0]] = vertexStatus[checkingEdge[1]] = groupKeyTmp;
                vertexGroup[groupKeyTmp] = [checkingEdge[0], checkingEdge[1]];
                tree.push(checkingEdge);
            }
            else if(vertexStatus[checkingEdge[0]] == -1 && vertexStatus[checkingEdge[1]] != -1){
                vertexStatus[checkingEdge[0]] = vertexStatus[checkingEdge[1]];
                vertexGroup[vertexStatus[checkingEdge[1]]].push(checkingEdge[0]);
                tree.push(checkingEdge);
            }
            else if(vertexStatus[checkingEdge[0]] != -1 && vertexStatus[checkingEdge[1]] == -1){
                vertexStatus[checkingEdge[1]] = vertexStatus[checkingEdge[0]];
                vertexGroup[vertexStatus[checkingEdge[0]]].push(checkingEdge[1]);
                tree.push(checkingEdge);
            }
            else if(vertexStatus[checkingEdge[0]] != vertexStatus[checkingEdge[1]]){
                groupKeyTmp = vertexStatus[checkingEdge[0]];
                for(var i in vertexGroup[groupKeyTmp]){
                    vertexStatus[vertexGroup[groupKeyTmp][i]] = vertexStatus[checkingEdge[1]];
                    vertexGroup[vertexStatus[checkingEdge[1]]].push(vertexGroup[groupKeyTmp][i]);
                }
                delete vertexGroup[groupKeyTmp];
                tree.push(checkingEdge);
            }
        }

        return tree;
    }
    
    // return if the point is in the polygon
    static inPolygon = (point, polygon) => { // is point in polygon
        if(!Array.isArray(polygon)) return 0;
        var x = point[0] || point.x || 0, y = point[1] || point.y || 0;
        var a = 0, x1, x2, y1, y2, cx;
        for(var i=0; i<polygon.length; i++){
            x1 = polygon[i][0] || polygon[i].x || 0;
            y1 = polygon[i][1] || polygon[i].y || 0;

            x2 = polygon[(i+1)%polygon.length][0] || polygon[(i+1)%polygon.length].x || 0;
            y2 = polygon[(i+1)%polygon.length][1] || polygon[(i+1)%polygon.length].y || 0;
            
            if((y1-y)*(y2-y) > 0 || (x1 < x && x2 < x)) continue;
            cx = (y-y1)*(x2-x1)/(y2-y1) + x1;
            if((x1-cx)*(cx-x2) >= 0 && x <= cx){
                if(cx == x) return 0.5;
                a++;
            }
        }

        return a%2;
    }
    
    // return the gravity center of the polygon
    static gcPolygon = (polygon) => {
        if(!Array.isArray(polygon)) return 0;
        var gx = 0, gy = 0, a = this.areaPolygon(polygon), x1, x2, y1, y2;

        for(var i=0; i<polygon.length; i++){
            x1 = polygon[i][0] || polygon[i].x || 0;
            y1 = polygon[i][1] || polygon[i].y || 0;

            x2 = polygon[(i+1)%polygon.length][0] || polygon[(i+1)%polygon.length].x || 0;
            y2 = polygon[(i+1)%polygon.length][1] || polygon[(i+1)%polygon.length].y || 0;
            
            if(x1-x2) gx += (y1-y2)/(x1-x2)/3 * (x2**3 - x1**3) + (y1-(y1-y2)/(x1-x2)*x1)/2 * (x2**2 - x1**2);
            if(y1-y2) gy += (x1-x2)/(y1-y2)/3 * (y2**3 - y1**3) + (x1-(x1-x2)/(y1-y2)*y1)/2 * (y2**2 - y1**2);
        }
        return [gx/a, -gy/a];
    }
    
    // return the area of the polygon
    static areaPolygon = (polygon) => {
        if(!Array.isArray(polygon)) return 0;
        var a = 0, x1, x2, y1, y2;
        for(var i=0; i<polygon.length; i++){
            x1 = polygon[i][0] || polygon[i].x || 0;
            y1 = polygon[i][1] || polygon[i].y || 0;

            x2 = polygon[(i+1)%polygon.length][0] || polygon[(i+1)%polygon.length].x || 0;
            y2 = polygon[(i+1)%polygon.length][1] || polygon[(i+1)%polygon.length].y || 0;
            
            a += (x1 * y2) - (x2 * y1);
        }
        a = Math.abs(a)/2;
        return a;
    }

    // make a Swal input form
    // columns: Array, example: [{type:"text", id:"qwe", class: "", attr:{}}]
    //    type: "text", "email", "url", "password", "number", "tel", "range", "textarea", "select", "radio", "checkbox", "file", "image", "file", "range", "color", "date", "time", "datetime", "datetime-local", "week", "month"
    //    id: String, the id of the input
    //    class: String, the class of the input
    //    attr: Object, the attributes of the input
    // config: Object
    //    keys: class, attr
    //    values: String, Function, if the value is a function, the function will be called with the type and id of the input
    static makeSwalIG = (columns, config) => { // [{type:"text", id:"qwe", class: "", attr:{}}]
        if(typeof Swal == "undefined") return {fire: async ()=>{console.log("Swal not defined"); return {value: null}}};
        if(!Array.isArray(columns)) return Swal;
        if(!Object.isDict(config)) config = {};

        var getCValue = (arg, type, id) => {
            if(typeof config[arg] == "string") return config[arg];
            else if(typeof config[arg] == "function") return config[arg](type, id);
            else if(arg == "class" && type) return "swal2-" + (["text", "email", "url", "password"].includes(type) ? "input" : type);
            else return null;
        }

        var getOptions = (col, i, theColID) => {
            return {
                id: theColID,
                class: col.class || getCValue("class", col.type, col.id || i),
                attr: Object.assign({}, getCValue("attr", col.type, col.id || i), col.attr)
            }
        }

        var html = "", ids = [], col, theColID, type;
        for(var i in columns){
            col = columns[i];
            type = col.type || "text";
            
            if(typeof col == "string") {
                theColID = col;
                html += this.createElement("input", {id: theColID, class: (getCValue("class", "text", col) || "swal2-input"), attr: getCValue("attr", "text", col)}).outerHTML;
                ids.push(col);
            }
            else if(Object.isDict(col)){
                theColID = col.id || "columns" + i;
                if(["text", "email", "url", "password", "file", "range"].includes(type)){
                    var tmp = this.createElement("input", getOptions(col, i, theColID));
                    tmp.setAttribute("type", type);
                    html += tmp.outerHTML;
                }
                else if(["textarea"].includes(type)){
                    html += this.createElement("textarea", getOptions(col, i, theColID)).outerHTML;
                }
                else if(["select"].includes(type)){
                    var options = col.options;
                    var select = this.createElement("select", getOptions(col, i, theColID));
                    for(var o in options){
                        if(typeof options[o] == "string"){
                            var option = this.createElement("option", {attr: {value: o}});
                            option.innerText = options[o];
                            select.appendChild(option);
                        }
                        else if(Object.isDict(options[o])){
                            var optgroup = this.createElement("optgroup", {attr: {label: o}});
                            for(var g in options[o]){
                                var option = this.createElement("option", {attr: {value: g}});
                                option.innerText = options[o][g];
                                optgroup.appendChild(option);
                            }
                            select.appendChild(optgroup);
                        }
                    }

                    html += select.outerHTML;
                }
                else if(["radio", "checkbox"].includes(type)){
                    var options = col.options;
                    var group = this.createElement("div", getOptions(col, i, theColID));
                    group.setAttribute("type", type);
                    for(var o in options){
                        var label = this.createElement("label", getOptions(Object.assign({}, col.label), i));
                        var input = this.createElement("input", Object.assign(getOptions(Object.assign({type: type}, col.input), i), {attr:{value: o, name: theColID, type: type}}));
                        var span = this.createElement("span", getOptions(Object.assign({type: "label"}, col.span), i));
                        
                        span.innerText = options[o];
                        label.appendChild(input);
                        label.appendChild(span);
                        group.appendChild(label);
                    }

                    html += group.outerHTML;
                }
                else continue;

                ids.push(theColID);
            }
        }

        return Swal.mixin({
            html: html,
            preConfirm: () => {
                var res = {};
                for(var i in ids){
                    var el = document.getElementById(ids[i]);
                    if(el.tagName == "DIV"){
                        if(el.getAttribute("type") == "radio"){
                            res[ids[i]] = [...el.querySelectorAll(`input[name=${ ids[i] }]`)].reduce((a,e)=>{if(e.checked)a=e.value;return a;}, null);
                        }
                        else if(el.getAttribute("type") == "checkbox"){
                            res[ids[i]] = [...el.querySelectorAll(`input[type=checkbox]`)].reduce((a,e)=>{if(e.checked)a.push(e.value);return a;}, []);
                        }
                    }
                    else if(el.type == "file") res[ids[i]] = el.files;
                    else res[ids[i]] = el.value;
                }
                return res;
            },
        });
    } // IG = InputGroup
    /*
    ["text", "email", "url", "password", "file", "range", "textarea", "select", "radio", "checkbox"]

    (async ()=>{const {value: r} = await makeSwalIG([
        "q", 
        {type:"text", id:"qwe0", class: "a", attr:{placeholder: ":O"}},
        {type:"email", id:"qwe1", class: "", attr:{placeholder: ":O"}},
        {type:"url", id:"qwe2", class: "c", attr:{placeholder: ":O"}},
        {type:"password", id:"qwe3", class: "d", attr:{placeholder: ":O"}},
        {type:"file", id:"qwe4", class: "e", attr:{}},
        {type:"range", id:"qwe5", class: "f", attr:{min:0, max:10, step:1}},
        {type:"textarea", id:"qwe6", class: "", attr:{placeholder: ":O"}},
        {type:"select", id:"qwe7", class: "h", options:{a:"A", b:"B", c:{q:"Q", w:"W"}}},
        {type:"radio", id:"qwe8", class: "i", options:{a:"A", b:"B"}},
        {type:"checkbox", id:"qwe9", class: "j", options:{a:"A", b:"B"}},
    ]).fire();
    console.log(r);})()
    */
    
    // toggle the theme between dark and light
    static darkmodeToggle = () => {
        var style = window.getComputedStyle(document.body);
        document.body.style.filter = style.filter=="none" ? "invert(1)" : "";
        
        [...document.querySelectorAll(":not(body)")].forEach((e) => {
            style = window.getComputedStyle(e);
            if(style.backgroundImage.startsWith("url")) e.style.filter = style.filter=="none" ? "invert(1)" : "";
        });
    }

    // toggle the menu of bootstrap by toggling the class "show"
    // $event: clickEvent
    static bootstrapSubMenuToggle = ($event) => {
        var L = this.lastToogle?.length ?? 0;

        if(!this.lastToogle?.length) {
            this.lastToogle = [$event.target];
            $event.target.nextSibling.classList.toggle('show');
        }

        for(var i=L-1 ;i>=0; i--){
            if($event.target == this.lastToogle[i]){
                $event.target.nextSibling.classList.toggle('show');
                break;
            }
            else if(!supfnc.isParentElement($event.target.parentElement, this.lastToogle[i].parentElement)){
                this.lastToogle[i].nextSibling?.classList?.toggle('show');
                this.lastToogle.pop();
                if(!i){
                    this.lastToogle.push($event.target);
                    $event.target.nextSibling.classList.toggle('show');
                }
            }
            else{
                this.lastToogle.push($event.target);
                $event.target.nextSibling.classList.toggle('show');
                break;
            }
        }
    };

    // a empty function for sample
    static untitledFnc = () => {
        return ;
    }
}

/* ----------------------------------- Heap Object ---------------------------------- */
// data structure: Heap
class heap{
    constructor(theType = 0){
        this.minmaxMultiply = (theType == "min" || theType === 0) ? 1 : -1;
        this.rootHeap = null;
    }

    insert(pointNowKey, pointNowWeight = 0){
        var nowVertexHeap = {
            key: pointNowKey,
            weight: pointNowWeight,
            children: [],
            childrenNum: [0, 0],
            parent: null,
        }
        
        if(!this.rootHeap){
            this.rootHeap = nowVertexHeap;
        }
        else{
            var tmpHeap = this.rootHeap;
            var chn, insertIdx;
            while(tmpHeap.children.length == 2){
                chn = tmpHeap.childrenNum;
                insertIdx = chn[0] <= chn[1] ? 0 : 1;

                chn[insertIdx]++;
                tmpHeap = tmpHeap.children[insertIdx];
            }

            for(var i=0; i<2; i++){
                if(!tmpHeap.children[i]){
                    tmpHeap.children[i] = nowVertexHeap;
                    tmpHeap.childrenNum[i]++;
                    nowVertexHeap.parent = tmpHeap;
                    break;
                }
            }
            var heapkeylist = ["key", "weight"];
            // if max heap minmaxMultiply = -1
            while(nowVertexHeap.parent && nowVertexHeap.weight * this.minmaxMultiply < nowVertexHeap.parent.weight * this.minmaxMultiply){
                for(var i in heapkeylist){
                    [nowVertexHeap[heapkeylist[i]], nowVertexHeap.parent[heapkeylist[i]]] = [nowVertexHeap.parent[heapkeylist[i]], nowVertexHeap[heapkeylist[i]]];
                }
                nowVertexHeap = nowVertexHeap.parent;
            }
        }
    }

    pop(){
        if(!this.rootHeap) return null;
        var tmpHeap = this.rootHeap;
        var rtn = [tmpHeap.key, tmpHeap.weight], minV, minIdx;

        while(tmpHeap.children.length){
            minV = Infinity;
            for(var i in tmpHeap.children){
                // if max heap minmaxMultiply = -1
                if(tmpHeap.children[i].weight * this.minmaxMultiply < minV * this.minmaxMultiply){
                    minV = tmpHeap.children[i].weight;
                    minIdx = i;
                }
            }
            tmpHeap.key = tmpHeap.children[minIdx].key;
            tmpHeap.weight = tmpHeap.children[minIdx].weight;
            tmpHeap.childrenNum[minIdx]--;

            tmpHeap = tmpHeap.children[minIdx];
        }
        if(tmpHeap.parent) tmpHeap.parent.children.splice(minIdx,1);

        return rtn;
    }

    get(){
        if(!this.rootHeap) return null;
        return [this.rootHeap.key, this.rootHeap.weight];
    }
}
/*
var h = new heap()
h.insert("A", 5)
h.insert("B", 8)
h.insert("C", 4)
h.insert("D", 10)
h.insert("E", 6)
h.insert("F", 7)
h.insert("G", 5)
console.log(minVertexHeap, minVertexHeapTop)
*/

// data structure: Symmetric Min-Max Heap
class SMMH{
    constructor(){
        this.rootHeap = {
            key: null,
            weight: null,
            children: [],
            childrenNum: [0, 0],
            parent: null,
        }
    }

    insert(pointNowKey, pointNowWeight = 0){
        var tmpHeap = this.rootHeap, chn, insertIdx;

        var nowVertexHeap = {
            key: pointNowKey,
            weight: pointNowWeight,
            children: [],
            childrenNum: [0, 0],
            parent: null,
        };

        while(tmpHeap.children.length == 2){
            chn = tmpHeap.childrenNum;
            insertIdx = chn[0] <= chn[1] ? 0 : 1;

            chn[insertIdx]++;
            tmpHeap = tmpHeap.children[insertIdx];
        }

        for(var i=0; i<2; i++){
            if(!tmpHeap.children[i]){
                tmpHeap.children[i] = nowVertexHeap;
                tmpHeap.childrenNum[i]++;
                nowVertexHeap.parent = tmpHeap;
                insertIdx = i;
                break;
            }
        }
        tmpHeap = nowVertexHeap;

        if(tmpHeap.parent.children.length == 2 && tmpHeap.weight * Math.pow(-1, insertIdx) > tmpHeap.parent.children[insertIdx?0:1].weight * Math.pow(-1, insertIdx)){
            [tmpHeap.parent.children[0].weight, tmpHeap.parent.children[1].weight] = [tmpHeap.parent.children[1].weight, tmpHeap.parent.children[0].weight];
            [tmpHeap.parent.children[0].key, tmpHeap.parent.children[1].key] = [tmpHeap.parent.children[1].key, tmpHeap.parent.children[0].key];
            tmpHeap = tmpHeap.parent.children[insertIdx?0:1];
        }
        
        while(tmpHeap.parent.parent && (tmpHeap.weight < tmpHeap.parent.parent.children[0].weight || tmpHeap.parent.parent.children[1] && tmpHeap.weight > tmpHeap.parent.parent.children[1].weight)){
            if(tmpHeap.weight < tmpHeap.parent.parent.children[0].weight){
                [tmpHeap.weight, tmpHeap.parent.parent.children[0].weight] = [tmpHeap.parent.parent.children[0].weight, tmpHeap.weight];
                [tmpHeap.key, tmpHeap.parent.parent.children[0].key] = [tmpHeap.parent.parent.children[0].key, tmpHeap.key];
                tmpHeap = tmpHeap.parent.parent.children[0];
            }
            else{
                [tmpHeap.weight, tmpHeap.parent.parent.children[1].weight] = [tmpHeap.parent.parent.children[1].weight, tmpHeap.weight];
                [tmpHeap.key, tmpHeap.parent.parent.children[1].key] = [tmpHeap.parent.parent.children[1].key, tmpHeap.key];
                tmpHeap = tmpHeap.parent.parent.children[1];
            }
        }
    }

    pop(popIdx){
        if(!this.rootHeap.children.length) return null;
        popIdx = popIdx ? 1 : 0;
        var minmaxMultiply = popIdx ? -1 : 1;

        var getValue = (list, index) => {
            if(!list) return null;
            return list[Math.min(index, list.length - 1)];
        }

        var tmpHeap = this.rootHeap;
        var rtn = [getValue(tmpHeap.children, popIdx).key, getValue(tmpHeap.children, popIdx).weight];
        var leftNode, rightNode;

        [leftNode, rightNode] = tmpHeap.children;
        while((leftNode && leftNode.children.length) || (rightNode && rightNode.children.length)){
            if(!getValue(leftNode.children, popIdx) || (getValue(rightNode.children, popIdx) && minmaxMultiply * getValue(leftNode.children, popIdx).weight >= minmaxMultiply * getValue(rightNode.children, popIdx).weight)){
                getValue(tmpHeap.children, popIdx).key = getValue(rightNode.children, popIdx).key;
                getValue(tmpHeap.children, popIdx).weight = getValue(rightNode.children, popIdx).weight;
                tmpHeap.childrenNum[1]--;
                tmpHeap = rightNode;
            }
            else if(!getValue(rightNode.children, popIdx) || (getValue(leftNode.children, popIdx) && minmaxMultiply * getValue(leftNode.children, popIdx).weight < minmaxMultiply * getValue(rightNode.children, popIdx).weight)){
                getValue(tmpHeap.children, popIdx).key = getValue(leftNode.children, popIdx).key;
                getValue(tmpHeap.children, popIdx).weight = getValue(leftNode.children, popIdx).weight;
                tmpHeap.childrenNum[0]--;
                tmpHeap = leftNode;
            }
            
            [leftNode, rightNode] = tmpHeap.children;
        }
        
        tmpHeap.children.splice(Math.min(tmpHeap.children.length-1, popIdx),1);
        tmpHeap.childrenNum.splice(Math.min(tmpHeap.childrenNum.length-1, popIdx),1);
        tmpHeap.childrenNum[1] = 0;

        return rtn;
    }

    popMin(){
        return this.pop(0);
    }

    popMax(){
        return this.pop(1);
    }

    getMin(){
        if(!this.rootHeap.children.length) return null;
        return [this.rootHeap.children[0].key, this.rootHeap.children[0].weight];
    }

    getMax(){
        if(!this.rootHeap.children.length) return null;
        return [this.rootHeap.children.slice(-1)[0].key, this.rootHeap.children.slice(-1)[0].weight];
    }
}
/* ----------------------------------- Heap Object ---------------------------------- */
// detect class changes
class ClassWatcher {
    // classToWatch: classes to watch for
    // classAddedCallback: callback function to run when class is added, pass mutated class name as argument
    // classRemovedCallback: callback function to run when class is removed, pass mutated class name as argument
    constructor(classToWatch, classAddedCallback, classRemovedCallback) {
        // check if classToWatch is an array of string, if not change it to an array of string
        if(!Array.isArray(classToWatch)) classToWatch = [classToWatch];
        classToWatch = classToWatch.map(className => className.toString());
        // check if classAddedCallback is a function, if not change it to a function
        if(typeof classAddedCallback !== 'function') classAddedCallback = () => {};
        // check if classRemovedCallback is a function, if not change it to a function
        if(typeof classRemovedCallback !== 'function') classRemovedCallback = () => {};

        // make a hash table to store the last class state, initialize it to null
        var lastClassState = classToWatch.reduce((acc, className) => {
            acc[className] = null;
            return acc;
        }, {});

        // create an observer instance
        observer = new MutationObserver(mutationsList => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    classToWatch.forEach(className => {
                        let currentClassState = mutation.target.classList.contains(className);
                        if(lastClassState[className] !== currentClassState) {
                            lastClassState[className] = currentClassState
                            if(currentClassState) {
                                classAddedCallback(className);
                            }
                            else {
                                classRemovedCallback(className);
                            }
                        }
                    });
                    return;
                }
            }
        });

        // target: DOM node to watch
        this.observe = (target) => {
            // check if Nodes is html element or a query selector
            if(typeof target === 'string') target = document.querySelector(target);
            else if(!(target instanceof HTMLElement)) throw new Error(`target: ${ target } is not a valid DOM node`);

            classToWatch.forEach(className => {
                lastClassState[className] = target.classList.contains(className);
            });
            observer.observe(target, { attributes: true });

            return this;
        }

        // stop watching
        this.disconnect = () => {
            observer.disconnect();
            return this;
        }
    }
}

// scroll watcher
// options example:
// {
//     root: "#baseApp",
//     rootMargin: "0px",
//     threshold: 0.0,
// };
class ScrollWatcher extends IntersectionObserver{
    // rootNode: DOM node to watch
    // intersectionCallback: callback function when intersection
    constructor(callback, options) {
        // check if Nodes is html element or a query selector
        if(typeof options.root === 'string') options.root = document.querySelector(options.root);
        else if(!(options.root instanceof HTMLElement)) throw new Error(`options.root: ${ options.root } is not a valid DOM node`);

        // check if callback is a function
        if(typeof callback !== 'function') throw new Error('callback is not a function');

        super(callback, options);
    }

    // targetNode: DOM node to watch
    observe(target){
        // check if Nodes is html element or a query selector
        if(typeof target === 'string') target = document.querySelector(target);
        else if(!(target instanceof HTMLElement)) throw new Error(`target: ${ target } is not a valid DOM node`);

        super.observe(target);
        return this;
    }
    
    disconnect(){
        super.disconnect();
        return this;
    }
}