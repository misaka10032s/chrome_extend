class HTTPreq{
    constructor(url, dataType, headers){
        this.url = typeof url != "string" ? "" : url;
        this.dataType = dataType == "fd" ? "fd" : "txt";
        this.headers = headers == undefined ? {} : headers;
        this.readyState = 0;
        this.status = 0;
        this.resultLength = 0;
        this.result = null;
    }

    async posta(data){
        this.sendReq("POST", data);
        await this.returnValue();
        return this;
    }
    async geta(data){
        this.sendReq("GET", data);
        await this.returnValue();
        return this;
    }

    post(data){
        var T = this;
        return new Promise((resolve) => {
            T.posta(data).then(rcv => resolve(rcv));
        });
    }
    get(data){
        var T = this;
        return new Promise((resolve) => {
            T.geta(data).then(rcv => resolve(rcv));
        });
    }

    json(rodwe = 0){ // rodwe = return origin data when error
        try{
            return supfnc.toJSON(this.result);
        }
        catch{
            return rodwe ? this.result: {};
        }
    }

    setUrl(url){
        this.url = typeof url != "string" ? "" : url;
        return this;
    }

    setDataType(dataType){
        this.dataType = dataType == "fd" ? "fd" : "txt";
        return this;
    }

    setHeaders(headers){
        this.headers = headers == undefined ? {} : headers;
        return this;
    }

    sendReq(method, data){
        var Xreq = new XMLHttpRequest(), sd, T = this;
        this.readyState = 0;
        this.result = null;

        Xreq.open(method, this.url);
        for (var i in this.headers) {
            Xreq.setRequestHeader(i, this.headers[i]);
        }

        Xreq.onreadystatechange = function () {
            if(Xreq.readyState == 4){
                T.status = Xreq.status;
                T.result = Xreq.responseText;
                T.resultLength = Xreq.responseText.length;
                
                setTimeout(()=>{
                    T.readyState = 4;
                }, Math.log10(T.resultLength) * 10);
            }
        }

        if(this.dataType == "txt"){
            if(!data){}
            else if(typeof data == "string") sd = data;
            else if(data.constructor.name == "FormData"){
                var s = {};
                data.forEach(function(value, key){
                    s[key] = value;
                });
                sd = JSON.stringify(s);
            }
            else sd = JSON.stringify(data);
        }
        else if(this.dataType == "fd"){
            if(!data){}
            else if(data.constructor.name == "FormData") sd = data;
            else{
                sd = new FormData();
                for(var i in data){
                    // sd.append(i, data[i]);
                    if(Array.isArray(data[i]) || data[i]?.constructor == Object) sd.append(i, JSON.stringify(data[i]));
                    else sd.append(i, data[i]);
                    // [Object, Array].includes(data[i] && data[i].constructor) ? sd.append(i, JSON.stringify(data[i])) : sd.append(i, data[i]);
                }
            }
        }
        Xreq.send(sd);
        this.Xreq = Xreq;
    }

    returnValue(){
        var T = this;
        return new Promise((resolve) => {
            var s = setInterval(()=>{
                if(T.result !== null && T.readyState == 4 && T.result.length == T.resultLength){
                    clearInterval(s);
                    resolve(T.result);
                }
            }, 10);
        });
    }
}