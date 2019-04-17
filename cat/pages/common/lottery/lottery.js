// pages/common/lottery/lottery.js
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        banner: {
            img: [
                '../../image/img6.png',
                '../../image/img6.png',
                '../../image/img6.png',
            ],
            current: 0,
            height: 0,
            indicatorDots: false, //是否显示pagination
            autoplay: false,
            interval: 5000,
            duration: 1000,
        },
        btns: [ //抽奖选项
            { key: 1, value: '人参，枸杞' },
            { key: 2, value: '海参，枸杞' },
            { key: 3, value: '人参，鹿茸' },
            { key: 4, value: '葡萄干' }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        _this.setData({
            id: app.config.id,
            title: app.config.title
        });
        // console.log(app.config.title + '--' + app.config.id);
        wx.setNavigationBarTitle({ title: _this.data.title }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f2f2f2',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        });
    },
    //设置轮播图高度自适应
    setBannerHeight(e) {
        var _this = this;
        var imgWidth = e.detail.width; //图片原始宽度
        var imgHeight = e.detail.height; //图片原始高度
        var sysInfo = wx.getSystemInfoSync(); //同步获取设备宽度
        var screenWidth = sysInfo.screenWidth; //获取屏幕宽度
        var scale = screenWidth / imgWidth;  //获取屏幕和原图比例
        //设置容器高度
        _this.data.banner.height = imgHeight * scale;
        _this.setData({
            banner: _this.data.banner
        });
    },
    //轮播图切换检测
    swiperChange: function (e) {
        var _this = this;
        if (e.detail.source == 'touch') {
            _this.data.banner.current = e.detail.current;
            _this.setData({
                banner: _this.data.banner
            })
        }
    },
    //选择抽奖选项
    btnsChange(e) {
        var _this = this;
        console.log('radio发生change事件，携带value值为：' + e.detail.value)
    },
    /*** 打开新页面
     *  ' <view class="my-list" bindtap="openWin" data-url="../my/goodfriend/goodfriend">'
     *  调用时绑定本事件的元素需配置 data-url ==> "页面路径"
    */
    openWin(e) {
        app.openWin(e.currentTarget.dataset.url);
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})