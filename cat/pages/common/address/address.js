// pages/common/address/address.js
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
        allCities: [],
        leftKey: 0, //左边菜单默认选中索引
        leftScrollTop: 0, //左边菜单区域滚动条位置
        winHeight: 0, //窗口可视高度
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var _this = this;
        wx.setNavigationBarTitle({ title: '城市' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f2f2f2',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        });
        _this.setData({
            allCities: app.config.cities
        });        
        //  获取可视区屏幕高度
        wx.getSystemInfo({
            success: function (res) {
                // percent 为当前设备1rpx对应的px值
                var percent = res.windowWidth / 750;
                _this.setData({
                    winHeight: res.windowHeight
                })
            }
        })
    },
    onCitySelect: function (e) {
        // console.log('城市选择', e.detail);
        var pages = getCurrentPages();
        if (pages.length >= 2) {
            var prePage = pages[pages.length - 2];
            prePage.setData({
                location: e.detail.city
            });
            app.config.selectCity = e.detail;
        };
        wx.navigateBack();
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
    //左边菜单切换
    leftClick(e) {
        var _this = this;
        _this.setData({
            leftKey: e.target.dataset.key,
            leftScrollTop: e.target.offsetTop - (_this.data.winHeight - 83 - 40) / 2
        });
    },
    //左边菜单栏显示更多
    downClick() {
        var _this = this;
        _this.setData({
            leftScrollTop: _this.data.leftScrollTop + 80
        });
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
    onReachBottom() {
        console.log('加载更多');
        var _this = this;
        setTimeout(() => {
            _this.setData({
                isHideLoadMore: true,
            })
        }, 1000)
    },
    /*** 打开新页面
     *  ' <view class="my-list" bindtap="openWin" data-url="../my/goodfriend/goodfriend">'
     *  调用时绑定本事件的元素需配置 data-url ==> "页面路径"
    */
    openWin(e) {
        app.openWin(e.currentTarget.dataset.url);
    },
})