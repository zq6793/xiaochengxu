
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
      text: "",
      searchValue: "", //搜索内容
      navKey: 0, //nav导航栏菜单默认选中索引
      isHideLoadMore: false, //是否显示 加载更多(默认false显示)
      winHeight: 0, //窗口可视高度
      type_0: 1, //好餐馆数据页
      page_0_isHideLoadMore: false, //好餐馆页是否显示 加载更多(默认false显示)
      page_0_isNoData: false, //是否没有好餐馆数据
      haocanguanData:[],//好餐馆数据
      type_1: 2, //拿手菜数据页码
      page_1_isHideLoadMore: false, //拿手菜是否显示 加载更多(默认false显示)
      page_1_isNoData: false, //是否没有最新帖子
      nashoucaiData: [], //拿手菜数据
      type_2: 3, //喵一喵数据页码
      page_2_isHideLoadMore: false, //喵一喵是否显示 加载更多(默认false显示)
      page_2_isNoData: false, //是否没有最新帖子
      miaoData: [], //喵一喵数据
      type_3: 4, //优惠劵数据页码
      page_3_isHideLoadMore: false, //优惠券是否显示 加载更多(默认false显示)
      page_3_isNoData: false, //是否没有最新帖子
      youhuiData: [], //优惠券数据
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        wx.setNavigationBarTitle({ title: '收藏' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f2f2f2',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
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
        });
        _this.gethaocanguanData({ type: _this.data.type_0, });
        _this.getnashoucaiData({ type: _this.data.type_1, });
        _this.getmiaoData({ type: _this.data.type_2, });
        _this.getyouhuijData({ type: _this.data.type_2, });
        
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
  //获取好餐馆数据
  gethaocanguanData({ type = _this.data.type_0}, callback) {
    var _this = this;
    app.ajax({ //获取openid
      url: 'getCollectList',
      type: "post",
      data: {
       type:type,
       page: 1,
       pageSize: 10
      },
      success: function (ret) {
        console.log(JSON.stringify(ret));
        if (ret.data) {
          _this.setData({ haocanguanData: ret.data });
        }
      },
      error: function (err) {
        app.toast({ title: '服务器错误,请稍后再试' });
      }
    });
  },
    //获取拿手菜数据
    getnashoucaiData({ type = _this.data.type_1 }, callback) {
        var _this = this;
        app.ajax({ //获取openid
            url: 'getCollectList',
            type: "post",
            data: {
                type: type,
            },
            success: function (ret) {
                console.log(JSON.stringify(ret));
                if (ret.data) {
                    _this.setData({ nashoucaiData: ret.data });
                }
            },
            error: function (err) {
                app.toast({ title: '服务器错误,请稍后再试' });
            }
        });
    },
    //获取喵一喵数据
    getmiaoData({ type = _this.data.type_2 }, callback) {
        var _this = this;
        app.ajax({ //获取openid
            url: 'getCollectList',
            type: "post",
            data: {
                type: type,
            },
            success: function (ret) {
                console.log(JSON.stringify(ret));
                if (ret.data) {
                    _this.setData({ miaoData: ret.data }); 
                }
            },
            error: function (err) {
                app.toast({ title: '服务器错误,请稍后再试' });
            }
        });
    },
    //获取优惠券数据
    getyouhuijData({ type = _this.data.type_3 }, callback) {
        var _this = this;
        app.ajax({ //获取openid
            url: 'getCollectList',
            type: "post",
            data: {
                type: type,
            },
            success: function (ret) {
                console.log(JSON.stringify(ret));
                if (ret.data) {
                    _this.setData({ youhuiData: ret.data });
                }
            },
            error: function (err) {
                app.toast({ title: '服务器错误,请稍后再试' });
            }
        });
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