
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        text: "",
        types: [ //类型
            { key: 1, value: '举报', checked: 'true' },
            { key: 2, value: '建议' }
        ],
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        wx.setNavigationBarTitle({ title: '举报/建议' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f5f5f5',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        });
    },
    //类型选择
    typesChange(e) {
        var _this = this;
        console.log('radio发生change事件，携带value值为：' + e.detail.value)
    },
    //左上角返回上一页
    back() {
        var _this = this;
        wx.navigateBack();
    },
    // 打开新页面
    openWin(e) {
        app.openWin(e.currentTarget.dataset.url);
    },
    
})