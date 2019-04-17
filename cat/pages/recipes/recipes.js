// pages/recipes/recipes.js
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        text: "",        
        searchValue: "", //搜索内容
        navKey: 0, //nav导航栏菜单默认选中索引
        leftKey: 0, //左边菜单默认选中索引
        leftId: '', //左边选中菜单的id
        isHideLoadMore: false, //是否显示 加载更多(默认false显示)
        leftScrollTop: 0, //左边菜单区域滚动条位置
        winHeight: 0, //窗口可视高度
        page_0: 1, //菜谱分类二级数据页
        pageSize_0: 20, //菜谱分类二级数据每页查询限制
        page_0_isHideLoadMore: false, //分类页是否显示 加载更多(默认false显示)
        page_0_isNoData: false, //是否没有二级分类数据
        classListsLeftData: [], //菜谱分类左侧一级分类数据
        classListsRightData: [], //菜谱分类右侧二级分类数据
        page_1: 1, //菜谱最新数据页码
        pageSize_1: 10, //菜谱最新数据每页查询限制
        page_1_isHideLoadMore: false, //菜谱最新是否显示 加载更多(默认false显示)
        page_1_isNoData: false, //是否没有菜谱最新帖子
        zuixinData: [], //菜谱最新数据
        page_2: 1, //菜谱最新数据页码
        pageSize_2: 10, //菜谱最新数据每页查询限制
        page_2_isHideLoadMore: false, //菜谱最新是否显示 加载更多(默认false显示)
        page_2_isNoData: false, //是否没有菜谱最新帖子
        qiuzhuData: [], //菜谱求助数据
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        wx.setNavigationBarTitle({ title: '菜谱' }); //设置wx导航栏title
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
        _this.getClassListsLeftData();
        _this.getZuixinData({page: _this.data.page_1, pageSize: _this.data.pageSize_1});
    }, 
    //页面显示后控制显示哪一页（针对首页菜单点击进入此页面）
    onShow() {
        var _this = this;
        _this.setData({
            navKey: getApp().config.recipes_pageIndex
        })
    },     
    // nav导航栏切换
    navTab(e) {
        var _this = this;
        _this.setData({
            navKey: e.target.dataset.key
        });
        getApp().config.recipes_pageIndex = e.target.dataset.key;
    },
    //左边菜单切换
    leftClick(e){
        var _this = this;
        _this.setData({
            leftKey: e.target.dataset.key,
            leftScrollTop: e.target.offsetTop - (_this.data.winHeight - 83 - 40) / 2,
            leftId: e.target.dataset.id, 
            page_0: 1
        });
        app.showLoad({ title: '', mask: true });
        _this.getClassListsRightData({
            pid: _this.data.leftId,
            page: _this.data.page_0,
            pageSize: _this.data.pageSize_0
        }, function(){
            app.hideLoad();
        });
    },
    //左边菜单栏显示更多
    downClick(){
        var _this = this;
        _this.setData({
            leftScrollTop: _this.data.leftScrollTop + 80
        });
    },
    //获取菜谱分类一级列表
    getClassListsLeftData(){
        var _this = this;
        app.ajax({ //获取openid
            url: 'getFoodMaterialTypeList',
            type: "post",
            data: {
                page: 1,
                pageSize: 10000,
                pid: ''
            },
            success: function (ret) {
                // console.log(ret);
                if(ret.data){
                    _this.setData({ classListsLeftData: ret.data, leftId: ret.data[0].id, page_0: 1 });
                    _this.getClassListsRightData({
                        pid: _this.data.leftId,
                        page: _this.data.page_0,
                        pageSize: _this.data.pageSize_0
                    });
                } 
                else
                {
                    app.toast({ title: '暂无菜谱分类数据' });
                }               
            },
            error: function (err) {
                app.toast({ title: '获取菜谱分类失败' });
            }
        });        
    },
    //获取菜谱分类二级列表
    getClassListsRightData({pid = _this.data.leftId, page = _this.data.page_0, pageSize = _this.data.pageSize_0 }, callback) {
        var _this = this;
        app.ajax({ //获取openid
            url: 'getFoodMaterialTypeList',
            type: "post",
            data: {
                page: page,
                pageSize: pageSize,
                pid: pid
            },
            success: function (ret) {
                // console.log(ret);
                if(ret.data)
                {
                    if (page == 1) { var lists = []; } else { var lists = _this.data.classListsRightData; }
                    lists = lists.concat(ret.data);
                    _this.setData({ classListsRightData: lists });
                    if (ret.data.length >= _this.data.pageSize_0) {
                        _this.setData({ page_0_isHideLoadMore: false });
                    }
                    else{
                        _this.setData({ page_0_isHideLoadMore: true });
                    }                    
                }  
                if (ret.data && ret.data.length > 0) {//有数据，隐藏无数据提示信息
                    _this.setData({ page_0_isNoData: false });
                }
                if (_this.data.classListsRightData.length <= 0) { //没有数据，显示无数据提示信息
                    _this.setData({ page_0_isNoData: true });
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
    //获取菜谱最新帖子数据
    getZuixinData({ page = _this.data.page_1, pageSize = _this.data.pageSize_1 }, callback){
        var _this = this;
        app.ajax({ //获取openid
            url: 'getCookingPostList',
            type: "post",
            data: {
                page: page,
                pageSize: pageSize,
            },
            success: function (ret) {
                console.log(page + '-' + pageSize + JSON.stringify(ret));
                if (ret.data) {
                    if (page == 1) { var lists = []; } else { var lists = _this.data.zuixinData;}
                    lists = lists.concat(ret.data);
                    _this.setData({ zuixinData: lists });
                    if (ret.data.length >= _this.data.pageSize_1) {
                        _this.setData({ page_1_isHideLoadMore: false });
                    }
                    else {
                        _this.setData({ page_1_isHideLoadMore: true });
                    }
                }
                if (ret.data && ret.data.length > 0) {//有数据，隐藏无数据提示信息
                    _this.setData({ page_1_isNoData: false });
                }
                if (_this.data.zuixinData.length <= 0) { //没有数据，显示无数据提示信息
                    _this.setData({ page_1_isNoData: true });
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
    //获取求助页数据
    getQiuzhuData({ page = _this.data.page_2, pageSize = _this.data.pageSize_2 }, callback){
        var _this = this;
        app.ajax({ //获取openid
            url: 'getCookingPostList',
            type: "post",
            data: {
                page: page,
                pageSize: pageSize,
            },
            success: function (ret) {
                console.log(ret);
                if (ret.data) {
                    if (page == 1) { var lists = []; } else { var lists = _this.data.qiuzhuData; }
                    lists = lists.concat(ret.data);
                    _this.setData({ qiuzhuData: lists });
                    if (ret.data.length >= _this.data.pageSize_2) {
                        _this.setData({ page_2_isHideLoadMore: false });
                    }
                    else {
                        _this.setData({ page_2_isHideLoadMore: true });
                    }
                }
                if (ret.data && ret.data.length > 0) {//有数据，隐藏无数据提示信息
                    _this.setData({ page_2_isNoData: false });
                }
                if (_this.data.qiuzhuData.length <= 0) {//没有数据，显示无数据提示信息
                    _this.setData({ page_2_isNoData: true });
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
    initData (callback) { 
        var _this = this;
        switch (Number(_this.data.navKey)) {
            case 0:
                _this.getClassListsRightData({
                    pid: _this.data.leftId,
                    page: _this.data.page_0,
                    pageSize: _this.data.pageSize_0
                }, function () {
                    if (typeof callback == "function" || typeof callback == "object") {
                        callback();
                    }
                });
                break;
            case 1:
                _this.getZuixinData({                    
                    page: _this.data.page_1,
                    pageSize: _this.data.pageSize_1
                }, function () {
                    if (typeof callback == "function" || typeof callback == "object") {
                        callback();
                    }
                });
                break;
            case 2:
                _this.getQiuzhuData({
                    page: _this.data.page_2,
                    pageSize: _this.data.pageSize_2
                }, function () {
                    if (typeof callback == "function" || typeof callback == "object") {
                        callback();
                    }
                });
                break;
        }
    },
    // 下拉刷新
    onPullDownRefresh() {        
        var _this = this;
        wx.showNavigationBarLoading() //在标题栏中显示加载
        switch (Number(_this.data.navKey)) {
            case 0: _this.setData({ page_0: 1 }); break;
            case 1: _this.setData({ page_1: 1 }); break;
            case 2: _this.setData({ page_2: 1 }); break;
        }
        _this.initData(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh();
        });
    },
    //加载更多
    onReachBottom: function () {
        console.log('加载更多');
        var _this = this;
        switch (Number(_this.data.navKey)) {
            case 0: 
                _this.setData({ page_0: _this.data.page_0 + 1 }); 
                _this.initData(function () {
                    _this.setData({ page_0_isHideLoadMore: true });
                });
                break;
            case 1: 
                _this.setData({ page_1: _this.data.page_1 + 1 });
                _this.initData(function () {
                    _this.setData({ page_1_isHideLoadMore: true });
                }); 
                break;
            case 2: 
                _this.setData({ page_2: _this.data.page_2 + 1 }); 
                _this.initData(function () {
                    _this.setData({ page_2_isHideLoadMore: true });
                });
                break;
        }                   
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