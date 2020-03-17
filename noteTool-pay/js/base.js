function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return decodeURIComponent(r[2]); 
    return undefined;
}

new Vue({
    el:'#app',
    data: {
        token: '',
        list: [],
        tips: '提示',
        userName: '',
        isShowModal: false,
    },
    created() {
        this.token = getQueryString('token');
        this.userName = getQueryString('userName');
        if (typeof(this.token) === 'undefined' || typeof(this.userName) === 'undefined') {
            this.isShowModal = true;
            this.tips = '缺少参数, 请从NoteTool小程序进入';
        }
    },
    mounted() {
        // alert(1);
        this.getList();
    },
    methods: {
        /**
         * 获取商品列表
         */
        getList() {
            var self = this;
            $.ajax({
                type: "get",
                url: 'https://api-notetool.catxs.com/api/vip/goods',
                data: {
                    token: self.token
                },
                dataType:"json",
                success: function(res) {
                    self.list = res.data
                },
                error: function(e) {
                    console.log('e', e.responseText);
                }
            });
        },
        /**
         * 购买
         * @param {*} id 
         */
        onShowBuy(id) {
            var self = this;
            $.ajax({
                type: "get",
                url: 'https://api-notetool.catxs.com/api/pay',
                data: {
                    token: self.token,
                    id: id
                },
                dataType:"json",
                success: function(res) {
                    self.wxPaySdk(res.data);
                }
            });
        },
        /**
         * 模态框确认
         */
        modalConfirm () {
            this.tips = '';
            this.isShowModal = false;
        },
        /**
         * 调用微信SDK
         * @param {object} data 后端返回的data 
         */
        wxPaySdk(data) {
            var self = this;
            try {
                WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    'appId': data.appId,
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonceStr,
                    'package': data.package,
                    'signType': data.signType,
                    'paySign': data.paySign
                }, function(wxRes) {
                    console.log(wxRes);
                    self.isShowModal = true;
                    if (wxRes.err_msg === 'get_brand_wcpay_request:ok') {
                        self.tips = '支付成功, 请返回小程序';
                    } else if (wxRes.err_msg === 'get_brand_wcpay_request:cancel') {
                        self.tips = '您已取消支付';
                    } else {
                        self.tips = '支付失败' + wxRes.err_msg + '如有疑问请联系客服';
                    }
                })
            } catch (error) {
                self.isShowModal = true;
                self.tips = '请在微信客户端调用';
            }
        }
    }
});