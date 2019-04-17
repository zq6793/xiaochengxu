
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        text: "",
        page: 1, //菜谱最新数据页码
        pageSize: 10, //菜谱最新数据每页查询限制
        page_isHideLoadMore: false, //菜谱最新是否显示 加载更多(默认false显示)
        page_isNoData: false, //是否没有菜谱最新帖子
        data:[],
        is_friend:'取消关注',
        no_friends:'加关注',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        wx.setNavigationBarTitle({ title: '粉丝' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f5f5f5',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        });
      _this.getFansList({ page: _this.data.page, pageSize: _this.data.pageSize });
    },
    //返回上一页
    back() {
        var _this = this;
        wx.navigateBack();
    },
    // 下拉刷新
    onPullDownRefresh() {
        var _this = this;
        wx.showNavigationBarLoading() //在标题栏中显示加载
         _this.setData({ page: 1 });
      _this.initData(function () {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      });
    },
    //加载更多
    onReachBottom() {
        console.log('加载更多');
        var _this = this;
        _this.setData({ page: _this.data.page + 1 });
        _this.initData(function () {
        _this.setData({ page_isHideLoadMore: true });
      });
    },
    //获取数据
  getFansList({ page = _this.data.page, pageSize = _this.data.pageSize }, callback) {
    var _this = this;
    app.ajax({ //获取openid
      url: 'getFansList',
      type: "post",
      data: {
        page: page,
        pageSize: pageSize,
      },
      success: function (ret) {
        console.log(page + '-' + pageSize + JSON.stringify(ret));
        if (ret.data) {
          if (page == 1) { var lists = []; } else { var lists = _this.data.data; }
          lists = lists.concat(ret.data);
          _this.setData({ data: lists });
          if (ret.data.length >= _this.data.pageSize) {
            _this.setData({ page_isHideLoadMore: false });
          }
          else {
            _this.setData({ page_isHideLoadMore: true });
          }
        }
        if (ret.data && ret.data.length > 0) {//有数据，隐藏无数据提示信息
          _this.setData({ page_isNoData: false });
        }
        if (_this.data.data.length <= 0) { //没有数据，显示无数据提示信息
          _this.setData({ page_isNoData: true });
        }
        if (typeof callback == "function" || typeof callback == "object") {
          callback();
        }
      },
      error: function (err) {
        app.toast({ title: '服务器错误,请稍后再试' });
      }
    });
  },
  //判断页面索引处理数据加载
  initData(callback) {
    var _this = this;
    _this.getFansList({
      page: _this.data.page,
      pageSize: _this.data.pageSize
    }, function () {
      if (typeof callback == "function" || typeof callback == "object") {
        callback();
      }
    });
  },
  // 打开新页面
  openWin(e) {
    app.config.title = e.currentTarget.dataset.title;
    app.config.id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },  
})