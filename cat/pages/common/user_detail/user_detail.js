// pages/common/user_detail/user_detail.js

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
        wx.setNavigationBarTitle({ title: '个人主页' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f2f2f2',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        });
    },
    // 搜索框输入检测
    searchInput(e) {
        var _this = this;
        _this.setData({
            searchValue: e.detail.value,
        });
        if (e.detail.value.length > 0) { //输入内容后 显示 清空输入内容按钮
            _this.setData({
                display: "inline-block"
            });
        }
        else {
            _this.setData({
                display: "none"
            });
        }
    },
    // 清空搜索狂输入内容
    clearSearchInput(e) {
        var _this = this;
        _this.setData({
            searchValue: "",
            display: "none"
        });
    },
    // nav导航栏切换
    navTab(e) {
        var _this = this;
        _this.setData({
            navKey: e.target.dataset.key
        })
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