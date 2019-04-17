
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        text: "",        
        searchValue: "", //搜索内容
        leftScrollTop: 0, //左边菜单区域滚动条位置
        isHideLoadMore: false, //是否显示 加载更多(默认false显示) 
        navKey: 0, //nav导航栏菜单默认选中索引        
        orderbyKey: -1, //排序菜单导航选中索引（默认全部未选中）                
        isShowMenuShangquan: false, //是否显示商圈排序菜单
        isShowMenuCaixi: false,  //是否显示菜系排序菜单
        isShowMenuJiage: false,  //是否显示价格排序菜单
        isShowMenuShaixuan: false,  //是否显示筛选排序菜单
        isCloseMenu: true, //排序弹窗是否关闭
        isSelected: false, //是否已选择菜单中某项排序子选项
        city_id: 357, //城市id(默认西安)
        page_0: 1, //分页页数
        pageSize_0: 30, //每页数据大小
        page_0_isHideLoadMore: false, //是否显示特色 加载更多(默认false显示) 
        page_0_isNoData: false, //是否没有特色数据
        teseData: [], //本地特色数据
        paihangData: [], //排行数据
        zuixinData: [], //最新数据
        qiuzhuData: [], //求助数据
        youhuiData: [], //优惠数据
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        wx.setNavigationBarTitle({ title: '餐厅' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f2f2f2',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        });        
        _this.initData();      
    },  
    //页面显示后控制显示哪一页（针对首页菜单点击进入此页面）
    onShow (){ 
        var _this = this;
        if (app.isDefine(app.config.selectCity)) { //如果已选择城市并且和旧城市id不同，则刷新页面
            if(_this.data.city_id != app.config.selectCity.id){
                console.log(app.config.selectCity); //在城市列表选择的城市数据
                _this.setData({ city_id: app.config.selectCity.id });
                _this.initData(); 
            }            
        }    
        // 设置页面显示哪一页
        _this.setData({
            navKey: getApp().config.restaurant_pageIndex,
            isShowMenuShangquan: false,
            isShowMenuCaixi: false,
            isShowMenuJiage: false,
            isShowMenuShaixuan: false
        });
        if (Number(getApp().config.restaurant_pageIndex) == 1 && _this.data.isCloseMenu == false) {
            _this.showMenu();
        }
    },  
    // nav导航栏切换
    navTab(e) {
        var _this = this;
        _this.setData({
            navKey: e.currentTarget.dataset.key,
            isShowMenuShangquan: false,
            isShowMenuCaixi: false,
            isShowMenuJiage: false,
            isShowMenuShaixuan: false
        });        
        getApp().config.restaurant_pageIndex = e.currentTarget.dataset.key;
        if (Number(e.currentTarget.dataset.key) == 1 && _this.data.isCloseMenu == false)
        {
            _this.showMenu();
        }
    },  
    orderbyTab: function(e){ //点击顶部排序导航按钮
        var _this = this;
        //console.log(e.currentTarget.dataset.key + '----' + _this.data.orderbyKey);
        if (e.currentTarget.dataset.key != _this.data.orderbyKey)
        {
            _this.setData({
                orderbyKey: Number(e.currentTarget.dataset.key),
                isCloseMenu: false
            });
            _this.showMenu();
        }        
        else{
            _this.setData({
                orderbyKey: -1,
                isCloseMenu: false
            });
            _this.showMenu();
        }
    },  
    showMenu: function () { //顶部排序导航对应弹窗页面显示操作
        var _this = this;
        _this.setData({
            isShowMenuShangquan: false,
            isShowMenuCaixi: false,
            isShowMenuJiage: false,
            isShowMenuShaixuan: false,
            isCloseMenu: false
        })        
        switch (Number(_this.data.orderbyKey)) {
            case 0: //显示商圈排序菜单
                _this.setData({isShowMenuShangquan: true})
                break;
            case 1: //显示菜系
                _this.setData({isShowMenuCaixi: true })
                break;
            case 2: //价格
                _this.setData({isShowMenuJiage: true })
                break;
            case 3: //筛选
                _this.setData({isShowMenuShaixuan: true })
                break;
        }
    },
    hideMenu: function(){ //排序菜单弹窗隐藏操作
        var _this = this;
        _this.setData({
            orderbyKey: -1,
            isCloseMenu: true,
            isShowMenuShangquan: false,
            isShowMenuCaixi: false,
            isShowMenuJiage: false,
            isShowMenuShaixuan: false            
        })
    },
    //获取本地特色列表数据
    getTeseData: function ({city_id = _this.data.city_id, page = _this.data.page_0, pageSize = _this.data.pageSize_0}, callback){ 
        var _this = this;
        app.ajax({
            url: 'getSnackList',
            type: "post",
            data: {
                city_id: city_id,
                page: page,
                pageSize: pageSize                                
            },
            success: function (ret) {
                // console.log(JSON.stringify(ret));
                if(ret.data)
                {
                    if (page == 1) { var lists = []; } else { var lists = _this.data.teseData; }
                    lists = lists.concat(ret.data);
                    _this.setData({ teseData: lists });
                    if (ret.data.length >= _this.data.pageSize_0) {
                        _this.setData({ page_0_isHideLoadMore: false });
                    }
                    else {
                        _this.setData({ page_0_isHideLoadMore: true });
                    }    
                } 
                if (ret.data && ret.data.length > 0) {//有数据，隐藏无数据提示信息
                    _this.setData({ page_0_isNoData: false });
                }
                if (_this.data.teseData.length <= 0) { //没有数据，显示无数据提示信息
                    _this.setData({ page_0_isNoData: true });
                }                 
                if (typeof callback == "function" || typeof callback == "object") {
                    callback();
                }   
            },
            error: function (err) {
                _this.setData({ isShowLoad: false });
                app.toast({ title: '获取特色数据失败' });
            }
        });
    },
    initData: function(callback){ //判断页面索引处理数据加载
        var _this = this;
        switch (Number(_this.data.navKey)) {
            case 0:
                _this.getTeseData({
                    city_id: _this.data.city_id,
                    page: _this.data.page_0,
                    pageSize: _this.data.pageSize_0
                }, function () {                    
                    if (typeof callback == "function" || typeof callback == "object") {
                        callback();
                    }  
                });
                break;
        }       
    },
    onPullDownRefresh() {// 下拉刷新
        var _this = this;
        wx.showNavigationBarLoading() //在标题栏中显示加载
        switch (Number(_this.data.navKey)) {
            case 0: _this.setData({ page_0: 1 }); break;
            case 1: _this.setData({ page_1: 1 }); break;
            case 2: _this.setData({ page_2: 1 }); break;
            case 3: _this.setData({ page_3: 1 }); break;
            case 4: _this.setData({ page_4: 1 }); break;
        }       
        _this.initData(function(){
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh();
        });
    },    
    onReachBottom: function () { //加载更多
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
            case 3:
                _this.setData({ page_3: _this.data.page_3 + 1 });
                _this.initData(function () {
                    _this.setData({ page_3_isHideLoadMore: true });
                });
                break;
            case 4:
                _this.setData({ page_4: _this.data.page_4 + 1 });
                _this.initData(function () {
                    _this.setData({ page_4_isHideLoadMore: true });
                });
                break;
        }                           
    },
    //用户点击添加本地特色
    openAddTese(e){
        var _this = this;
        app.ajax({
            url: 'getUser',
            type: "post",
            data: {
                
            },
            success: function (ret) {
                // console.log(JSON.stringify(ret));
                if (ret.data.user.level < 2)
                { //等级不足                    
                    app.toast({ title: "您的级别尚未达到等级"});
                }
                else
                {
                    wx.navigateTo({
                        url: e.currentTarget.dataset.url,
                    })
                }
            },
            error: function (err) {
                _this.setData({ isShowLoad: false });
                app.toast({ title: '获取特色数据失败' });
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