
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        is_show_hcg: true, //是否显示  好友本地好餐馆  的内容
        is_show_ccg: false, //是否显示  好友本地差餐馆  的内容
        is_show_nsc: true, //是否显示  好友拿手菜  的内容
        is_show_mym: true, //是否显示  好友喵一喵  的内容
        is_show_jxt: true, //是否显示  好友匠心淘  的内容
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        wx.setNavigationBarTitle({ title: '首页设置' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f5f5f5',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        });
    },
    changeHcg(e) { //选择是否显示  好友本地好餐馆  的内容
        var _this = this;
        _this.setData({
            is_show_hcg: !_this.data.is_show_hcg
        });
    },
    changeCcg(e) { //选择是否显示  好友本地差餐馆  的内容
        var _this = this;
        _this.setData({
            is_show_ccg: !_this.data.is_show_ccg
        });
    },
    changeNsc(e) { //选择是否显示  好友拿手菜  的内容
        var _this = this;
        _this.setData({
            is_show_nsc: !_this.data.is_show_nsc
        });
    },
    changeMym(e) { //选择是否显示  好友喵一喵  的内容
        var _this = this;
        _this.setData({
            is_show_mym: !_this.data.is_show_mym
        });
    },
    changeJxt(e) { //选择是否显示  好友匠心淘  的内容
        var _this = this;
        _this.setData({
            is_show_jxt: !_this.data.is_show_jxt
        });
    },
    // 打开新页面
    openWin(e) {
        app.openWin(e.currentTarget.dataset.url);
    },
})