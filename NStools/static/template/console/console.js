const baseapp = Vue.createApp({
    data() {
        return {
            tabBox: [
                {id: "redirector", name: "重新導向", }
            ],
            redirector: [],
        }
    },
    methods: {
    },
    mounted(){
        new HTTPreq("/i_search/get_logo/").geta().then((rcv)=>{
            var res = supfnc.toJSON(rcv.result);
            var company_name = document.getElementById("company_name");
            if(company_name) company_name.innerHTML = res.company_name;
            [...document.getElementsByTagName("img")].forEach((e)=>{if(e.src.includes("#logo.png")) e.src = res.logo});
            [...document.getElementsByTagName("title")].forEach((e)=>{e.innerHTML = res.company_name;});
        });
    },
    created(){},
    updated(){},
    beforeUpdate(){},
});
const vm = baseapp.mount("#app");

console.log(chrome.storage)