new Vue({
    el:'#app',
    data: {
        showBtn: true,
        message:'hello vue.js.',
        step: 1, // 步骤
        tips: '原生听一遍',
        en: `I'm trying very hard`,
        cn: '我很努力了',
        fastAudio: ''
    },
    created() {
        function getQueryString(name) { 
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
            var r = window.location.search.substr(1).match(reg); 
            if (r != null) return decodeURIComponent(r[2]); 
            return null;
        }
        this.en = getQueryString('en');
        this.cn = getQueryString('cn')
    },
    mounted() {
        

        /* 视频播放完成 */
        this.$refs.video1.addEventListener("ended", () => {
            this.$refs.audio1.play();
        });

        /* 音效1 - 结束 */
        this.$refs.audio1.addEventListener("ended", () => {
            this.step = 2;
            this.tips = '慢速跟读一遍';
            this.$refs.slowAudio.play()
        });

        /* 慢音效 播放完成 */
        this.$refs.slowAudio.addEventListener("ended", () => {
            this.$refs.audio2.play()
        });

        /* 音效2 - 结束 */
        this.$refs.audio2.addEventListener("ended", () => {
            this.$refs.fastAudio.play()
            this.step = 3;
            this.tips = '常速听一遍';
        });

        /* 快音效 播放完成 */
        this.$refs.fastAudio.addEventListener("ended", () => {
            // this.step = 1;
            // this.tips = '原生听一遍';
            // this.$refs.video1.play();
            console.log('结束了重置开始');
        });
    },
    methods: {
        playVideo(){
            this.showBtn = false;
            this.$refs.video1.play();
        }
    }
});