
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        text: "", 
        signoutFlag: false       
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        wx.setNavigationBarTitle({ title: '个人中心' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f5f5f5',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        });
    },
    //左上角返回上一页
    back(){
        var _this = this;
        wx.navigateBack();
    },
    // 打开新页面
    openWin(e){
        app.openWin(e.currentTarget.dataset.url);
    },
    //退出
    signOut(){
        var _this = this;
        _this.setData({
            signoutFlag: true
        });
    },
    // 隐藏confirm退出确认弹窗
    hideConfirm(){
        var _this = this;
        _this.setData({
            signoutFlag: false
        });
    },
})