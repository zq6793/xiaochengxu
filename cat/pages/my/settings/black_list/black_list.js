
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        wx.setNavigationBarTitle({ title: '黑名单设置' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f5f5f5',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        });
    },
    // 打开新页面
    openWin(e) {
        app.openWin(e.currentTarget.dataset.url);
    },
    deleteClick(e){
        var _this = this;
        app.dialog({
            title: "移出黑名单",
            content: "确定要把此人移出黑名单吗？",
            mask: true,
            cancelText: "取消",
            confirmText: "移出",
            confirmColor: "#FF0000"
        },function(ret){
            if(ret.index == 1)
            {//确定移出

            }
        });
    }
})