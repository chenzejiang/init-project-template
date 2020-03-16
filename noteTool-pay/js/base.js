new Vue({
    el:'#app',
    data: {
        token: '',
        list: []
    },
    created() {
        function getQueryString(name) { 
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
            var r = window.location.search.substr(1).match(reg); 
            if (r != null) return decodeURIComponent(r[2]); 
            return null;
        }
        this.token = getQueryString('token');
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            var self = this;
            $.ajax({
                type: "get",
                url: 'https://api-notetool.catxs.com/api/vip/goods',
                data: {
                    token: self.token
                },
                dataType:"json",
                success: (res) => {
                    this.list = res.data
                }
            });
        },
        onShowBuy(id) {
            var self = this;
            $.ajax({
                type: "get",
                url: 'https://api-notetool.catxs.com/api/vip/pay',
                data: {
                    token: self.token,
                    id: id
                },
                dataType:"json",
                success: (res) => {

                    this.wxPaySdk();
                    // this.list = res.data
                }
            });
        },
        wxPaySdk(data) {
             // let _this = this
             return new Promise((resolve, reject) => {
                if (ua.isWx) {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                            'appId': data.appId, // 公众号名称，由商户传入
                            'timeStamp': data.timeStamp, // 时间戳，自1970年以来的秒数
                            'nonceStr': data.nonceStr, // 随机串
                            'package': data.package,
                            'signType': data.signType, // 微信签名方式：
                            'paySign': data.paySign // 微信签名
                        },
                        wxRes => {
                        if (wxRes.err_msg === 'get_brand_wcpay_request:ok') {
                            resolve()
                        } else if (wxRes.err_msg === 'get_brand_wcpay_request:cancel') {
                            reject(String('已取消支付'))
                        } else if (wxRes.err_msg === 'get_brand_wcpay_request:fail') {
                            reject(String('支付失败'))
                        }
                    })
                }
            })
        }

    }
});