
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        text: "",        
        searchValue: "", //搜索内容
        navKey: 0, //nav导航栏菜单默认选中索引
        isHideLoadMore: false, //是否显示 加载更多(默认false不显示)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        wx.setNavigationBarTitle({ title: '喵喵' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f2f2f2',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        });
    },
    //页面显示后控制显示哪一页（针对首页菜单点击进入此页面）
    onShow() {
        var _this = this;
        _this.setData({
            navKey: getApp().config.meowmeow_pageIndex
        })
    },  
    // nav导航栏切换
    navTab(e) {
        var _this = this;
        _this.setData({
            navKey: e.target.dataset.key
        })
        getApp().config.meowmeow_pageIndex = e.target.dataset.key;
    },
    onPullDownRefresh() {
        // 上拉刷新
        wx.showNavigationBarLoading() //在标题栏中显示加载
        if (!this.loading) {
            setTimeout(() => {
                console.log(111);
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh()
            }, 1000);
        }
    },
    //加载更多
    onReachBottom: function () {
        console.log('加载更多');
        var _this = this;
        setTimeout(() => {
            _this.setData({
                isHideLoadMore: true,
            })
        }, 1000)
    },
    // 打开新页面
    openWin(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
})