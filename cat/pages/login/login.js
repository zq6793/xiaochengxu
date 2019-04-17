// pages/login/login.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowLoad: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) { //用户已授权
                    _this.getOpenId(function(openId){
                        _this.login(openId);                        
                    });                    
                }
                else{
                    // app.hideLoad();
                    _this.setData({isShowLoad: false});
                }
            }
        });
    },
    onShow() {
        // app.showLoad({title: '验证登录中...', mask: true});   
    },
    getOpenId: function(callback){ //获取openID
        var _this = this;        
        wx.getUserInfo({
            success: function (res) {
                // 用户授权成功后，调用微信的 wx.login 接口，从而获取code
                wx.login({
                    success: res => {
                        // 获取到用户的 code 之后：res.code
                        //console.log("code:" + res.code);
                        app.ajax({ //获取openid
                            url: 'getOpenId',
                            type: "post",
                            data: {
                                code: res.code
                            },
                            success: function (ret) {
                                // console.log(JSON.stringify(ret));
                                //console.log("openId:"+ret.data.open_id);
                                if (typeof callback == "function" || typeof callback == "object") {
                                    callback(ret.data.open_id);
                                }                            
                            },
                            error: function (err) {
                                _this.setData({ isShowLoad: false });
                                app.toast({title: '获取openID失败'});
                            }
                        });
                    }
                });
            }
        });
    },
    register: function (openid, nickname, thumb, gender, callback) {//检测到用户未授权时，点击允许授权同时注册
        var _this = this;        
        var data = {
            openid: openid,
            nickname: nickname,
            thumb: thumb,
            gender: gender
        };
        // console.log(JSON.stringify(data));
        app.ajax({
            url: 'register',
            type: "post",
            data: data,
            success: function (ret) {
                //console.log(JSON.stringify(ret));
                app.hideLoad();
                //两种方式将个人信息分别存储到 app.config + 本地
                app.config.isLogin = true;
                app.config.token = ret.data.app_token;
                app.config.userInfo = { 
                    id: ret.data.id, 
                    openid: ret.data.openid, 
                    nickname: ret.data.nickname, 
                    thumb: ret.data.thumb, 
                    gender: ret.data.gender,                    
                }
                wx.setStorageSync('isLogin', app.config.isLogin);
                wx.setStorageSync('token', app.config.token);
                wx.setStorageSync('userInfo', app.config.userInfo); 
                wx.reLaunch({
                    url: "../index/index"
                });
            },
            error: function (err) {
                app.hideLoad();
                _this.setData({ isShowLoad: false });
                app.toast({ title: '注册失败' });
            }
        });
    },
    login: function (openid, callback) {//检测到用户已授权时，登录
        var _this = this;
        app.showLoad({ title: '授权登录中...', mask: true });
        app.ajax({ 
            url: 'login',
            type: "post",
            data: {
                openid: openid
            },
            success: function (ret) {
                //console.log(JSON.stringify(ret));
                app.hideLoad();
                //两种方式将个人信息分别存储到 app.config + 本地
                app.config.isLogin = true;
                app.config.token = ret.data.app_token;
                app.config.userInfo = {
                    id: ret.data.id,
                    openid: ret.data.openid,
                    nickname: ret.data.nickname,
                    thumb: ret.data.thumb,
                    gender: ret.data.gender,
                }  
                wx.setStorageSync('isLogin', app.config.isLogin);
                wx.setStorageSync('token', app.config.token);
                wx.setStorageSync('userInfo', app.config.userInfo);              
                wx.reLaunch({
                    url: "../index/index"
                });
            },
            error: function (err) {
                app.hideLoad();
                _this.setData({ isShowLoad: false });
                app.toast({ title: '登录失败' });
            }
        });
    },
    bindGetUserInfo: function (e) { //点击弹窗中允许授权按钮
        var userInfo = e.detail.userInfo;
        if (userInfo) {
            //用户按了允许授权按钮
            var _this = this;
            app.showLoad({ title: '授权登录中...', mask: true });
            // 获取到用户的信息了，打印到控制台上看下
            console.log("userInfo:" + JSON.stringify(userInfo));
            _this.getOpenId(function (openId) {
                _this.register(openId, userInfo.nickName, userInfo.avatarUrl, userInfo.gender);                
            });    
        } else {
            //用户按了拒绝按钮
            app.dialog({
                title: "警告",
                content: "您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!",
                mask: true,
                showCancel: false,                
                confirmText: "返回授权",
                confirmColor: "#FF9204"
            }, function (ret) {
                if (ret.index == 1) {//确定移出

                }
            });           
        }
    }
})