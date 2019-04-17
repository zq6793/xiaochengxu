
//app.js
var _public = require('public/public.js');
App({
    config: {
        title: '', //页面标题
        id: '', //id
        isLogin: false, //是否登录
        openId: '', //用户openId
        userInfo: '', //用户信息
        cities: {cities: {}}, //城市数据
        selectCity: null, //选择的城市数据
        serverUrl: _public.serverUrl, //接口地址
        flag: false,
        userInfo: null,
        index_pageIndex: 0, //首页选项卡显示第几页控制器/检测器
        restaurant_pageIndex: 0, //餐厅页面选项卡显示第几项控制器/检测器
        recipes_pageIndex: 0, //菜谱页面选项卡显示第几项控制器/检测器
        meowmeow_pageIndex: 0, //喵喵页面选项卡显示第几项控制器/检测器
    },
    isDefine: _public.isDefine, //判断字符串是否为空
    ajax: _public.ajax, //ajax数据请求
    uploadFile: _public.uploadFile, //文件上传
    openWin: _public.openWin, //打开新页面
    back: _public.back, //返回上一页
    showLoad: _public.showLoad, //显示加载弹窗
    hideLoad: _public.hideLoad, //关闭加载弹窗
    toast: _public.toast, //显示消息提示弹窗
    dialog: _public.dialog, //显示模态弹窗
    actionSheet: _public.actionSheet, //操作菜单
    chooseImage: _public.chooseImage, //选择图片
    
    onLaunch: function () {
        // 展示本地存储能力
        var _this = this;
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)                
        
    },
    getCity: function (country_id = '', keyword='', callback){ //获取城市数据
        var _this = this;
        _this.ajax({ //获取openid
            url: 'getCityList',
            type: "post",
            data: {
                country_id: country_id,
                keyword: keyword
            },
            success: function (ret) {                
                function objKeySort(obj) {//排序的函数
                    var newkey = Object.keys(obj).sort();
                    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
                    var newObj = {};//创建一个新的对象，用于存放排好序的键值对
                    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
                        newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
                    }
                    return newObj;//返回排好序的新对象
                }
                ret.data = objKeySort(ret.data);
                // console.log(JSON.stringify(ret));
                _this.config.cities.cities = ret.data;
                if (typeof callback == "function" || typeof callback == "object") {
                    callback();
                }   
            },
            error: function (err) {
                _this.setData({ isShowLoad: false });
                app.toast({ title: '获取城市失败！' });
            }
        });        
    }
})