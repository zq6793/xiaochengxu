// pages/index/index.js
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        text: "",
        banner: {
            img: [
                '../image/banner.png',
                '../image/banner.png',
                '../image/banner.png',
            ],
            height: 0,
            indicatorDots: true,
            autoplay: true,
            interval: 5000,
            duration: 500
        },
        adbanner: {
            img: [
                '../image/img4.png',
                '../image/img4.png',
                '../image/img4.png',
            ],
            height: 0,
            indicatorDots: false,
            autoplay: true,
            interval: 5000,
            duration: 500
        },
        noticebanner: {
            img: [
                '../image/img5.png',
                '../image/img5.png',
                '../image/img5.png',
            ],
            height: 0,
            indicatorDots: false,
            autoplay: true,
            interval: 5000,
            duration: 500
        },
        searchValue: "", //搜索内容
        navKey: 0, //nav导航栏菜单默认选中索引
        isHideLoadMore: false, //是否显示 加载更多(默认false不显示)
        isShowModal: true, //是否隐藏 帖子列表右上角点击所显示的模态弹窗
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var _this = this;
        wx.setNavigationBarTitle({title: '首页' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f2f2f2',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        }); 
        app.getCity(); //获取城市分组
        // console.log(app.config.isLogin);
        // console.log(app.config.token);
        // console.log(app.config.userInfo);       
    },
    //页面显示后控制显示哪一页
    onShow() {
        var _this = this;
        _this.setData({
            navKey: getApp().config.index_pageIndex,            
        });
        if(app.isDefine(app.config.selectCity))
        {
            console.log(app.config.selectCity); //在城市列表选择的城市数据
        }        
    },    
    //设置轮播图高度自适应
    setBannerHeight(e) {
        var _this = this;
        var imgWidth = e.detail.width; //图片原始宽度
        var imgHeight = e.detail.height; //图片原始高度
        var sysInfo = wx.getSystemInfoSync(); //同步获取设备宽度
        var screenWidth = sysInfo.screenWidth; //获取屏幕宽度
        var scale = screenWidth / imgWidth;  //获取屏幕和原图比例
        //设置容器高度
        _this.data.banner.height = imgHeight * scale + 5;
        _this.data.adbanner.height = imgHeight * scale + 60;
        _this.data.noticebanner.height = imgHeight * scale + 60;
        _this.setData({
            banner: _this.data.banner,
            adbanner: _this.data.adbanner,
            noticebanner: _this.data.noticebanner
        });
    },
    // nav导航栏切换
    navTab(e){
        var _this = this; 
        _this.setData({
            navKey: e.target.dataset.key
        })
        getApp().config.index_pageIndex = e.target.dataset.key;
    },
    onPullDownRefresh() {
        // 上拉刷新
        wx.showNavigationBarLoading() //在标题栏中显示加载
        if (!this.loading) {
            setTimeout(() =>{
                console.log(111);
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh()
            },1000);
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
        app.config.title = e.currentTarget.dataset.title;
        app.config.id = e.currentTarget.dataset.id;
        app.openWin(e.currentTarget.dataset.url);
    },
    //本地特色、餐厅排行、求推荐、优惠券 跳转
    openRestaurant(e){
        //改变全局变量==>进入餐厅页面后控制页面跳转到特定选项
        getApp().config.restaurant_pageIndex = Number(e.currentTarget.dataset.pageindex);
        wx.switchTab({
            url: e.currentTarget.dataset.url,
        })
    },
    //菜谱分类 跳转
    openRecipes(e) {
        //改变全局变量==>进入餐厅页面后控制页面跳转到特定选项
        getApp().config.recipes_pageIndex = Number(e.currentTarget.dataset.pageindex);
        wx.switchTab({
            url: e.currentTarget.dataset.url,
        })
    },
    //玩儿、同城约 跳转
    openMeowmeow(e) {
        //改变全局变量==>进入餐厅页面后控制页面跳转到特定选项
        getApp().config.meowmeow_pageIndex = Number(e.currentTarget.dataset.pageindex);
        wx.switchTab({
            url: e.currentTarget.dataset.url,
        })
    },
    //点击帖子右上角 显示自定义模态弹窗
    clickShowModal(e){
        var _this = this;
        _this.setData({
            isShowModal: false
        });
    },  
    //点击关闭按钮或拖动页面 隐藏自定义模态弹窗
    clickHideModal(e) {
        var _this = this;
        _this.setData({
            isShowModal: true
        });
    },
})