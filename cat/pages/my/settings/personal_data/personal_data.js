
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        text: "",
        nickname: '', //昵称
        sex: [ //性别
            {key: 1, value: '男', checked: 'true'},
            {key: 2, value: '女'}            
        ],
        citys: '', //常驻城市
        citys_sxcd: '', //常驻城市的熟悉程度
        autograph: '', //签名
        washwell: '', //口味喜好
        img: '', //顶部图片
        hidePicbtn: false, //是否隐藏上传图片按钮
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        wx.setNavigationBarTitle({ title: '基本设置' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f5f5f5',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        });
    },
    //性别选择
    sexChange(e) {
        var _this = this;
        console.log('radio发生change事件，携带value值为：'+ e.detail.value)
    },
    //选择图片
    chooseImg(e){
        var _this = this;
        app.chooseImage({
            success: function (ret) {
                // console.log(ret.data.tempFilePaths);
                _this.setData({
                    img: ret.data.tempFilePaths,
                    hidePicbtn: true
                });
            }
        });
    },
    // 打开新页面
    openWin(e) {
        app.openWin(e.currentTarget.dataset.url);
    },    
})