
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        text: "",
        navKey: 0, //nav导航栏菜单默认选中索引     
        dataList: [
            {
                pageIndex: 0, //页面索引
                banner: '', //顶部图片
                bannerIsShow: false, //上传顶部banner区域是否显示上传的图片
                itemsKey: -1, //文本编辑器索引
                inputText: '', //输入框的输入值
                items: [{ value: '', images: [] }] //文本编辑器生成结果  items: [{value: '', images: ['', '']}]
            }]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var _this = this;
        wx.setNavigationBarTitle({ title: '助猫为乐' }); //设置wx导航栏title
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f2f2f2',
            animation: {
                duration: 300,
                timingFunc: 'easeIn'
            }
        });
    },
    /*** 打开新页面
     *  ' <view class="my-list" bindtap="openWin" data-url="../my/goodfriend/goodfriend">'
     *  调用时绑定本事件的元素需配置 data-url ==> "页面路径"
    */
    openWin(e) {
        app.openWin(e.currentTarget.dataset.url);
    },
    //富文本编辑框输入检测
    textareaChange(e) {
        var _this = this;
        var navKey = _this.data.navKey; //页面索引
        var itemsindex = e.currentTarget.dataset.itemsindex; //dataList => items的索引
        var imgindex = e.currentTarget.dataset.imgindex; //dataList => items =>images 的索引
        _this.data.dataList[navKey].inputText = e.detail.value;
        _this.setData({
            dataList: _this.data.dataList,
        });
        // console.log(_this.data.inputText);
        // console.log(_this.data.dataList[navKey]);
    },
    // 文本编辑输入文字后添加到数据列表中 && 增加当前编辑索引 + 1
    addText() {
        var _this = this;
        var navKey = _this.data.navKey; //页面索引
        if (app.isDefine(_this.data.dataList[navKey].inputText)) {
            _this.data.dataList[navKey].itemsKey = _this.data.dataList[navKey].itemsKey + 1;
            _this.setData({
                dataList: _this.data.dataList,
            });
            if (_this.data.dataList[navKey].items[_this.data.dataList[navKey].itemsKey]) {
                _this.data.dataList[navKey].items[_this.data.dataList[navKey].itemsKey]["value"] = _this.data.dataList[navKey].inputText;
            }
            else {
                _this.data.dataList[navKey].items.push({ value: _this.data.dataList[navKey].inputText, images: [] });
            }
        }
        else {
            if (_this.data.dataList[navKey].itemsKey == -1) {
                _this.data.dataList[navKey].itemsKey = _this.data.dataList[navKey].itemsKey + 1;
                _this.setData({
                    dataList: _this.data.dataList,
                });
            }
        }
    },
    // 小按钮上传图片
    updateImage() {
        var _this = this;
        var navKey = _this.data.navKey; //页面索引
        app.chooseImage({
            success: function (ret) {
                // console.log(ret);
                _this.addText();
                _this.data.dataList[navKey].items[_this.data.dataList[navKey].itemsKey]["images"].push(ret.data.tempFilePaths);
                _this.data.dataList[navKey].inputText = "";
                _this.setData({
                    dataList: _this.data.dataList,
                });
                console.log(_this.data.dataList[navKey]);
            }
        });
    },
    // 已输入内容编辑修改
    editText(e) {
        var _this = this;
        var navKey = _this.data.navKey; //页面索引
        var itemsindex = e.currentTarget.dataset.itemsindex; //dataList => items的索引        
        _this.data.dataList[navKey].items[itemsindex]["value"] = e.detail.value;
        _this.setData({
            dataList: _this.data.dataList,
        });
        // console.log(_this.data.dataList[navKey]);    
    },
    // 已上传图片编辑重新上传
    editImg(e) {
        var _this = this;
        var navKey = _this.data.navKey; //页面索引
        var itemsindex = e.currentTarget.dataset.itemsindex; //dataList => items的索引
        var imgindex = e.currentTarget.dataset.imgindex; //dataList => items =>images 的索引
        app.chooseImage({
            success: function (ret) {
                // console.log(ret.data.tempFilePaths);
                _this.data.dataList[navKey].items[itemsindex].images[imgindex] = ret.data.tempFilePaths;
                _this.setData({
                    dataList: _this.data.dataList,
                });
                console.log(_this.data.dataList[navKey]);
            }
        });
    },
    //已上传图片删除操作
    deleteImg(e) {
        var _this = this;
        var navKey = _this.data.navKey; //页面索引
        var itemsindex = e.currentTarget.dataset.itemsindex; //dataList => items的索引
        var imgindex = e.currentTarget.dataset.imgindex; //dataList => items =>images 的索引
        app.dialog({
            title: "删除图片",
            content: "确定删除此图片吗？",
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#646464",
            confirmText: "删除",
            confirmColor: "#FF0000",
        }, function (ret) {
            if (ret.index == 1) {
                _this.data.dataList[navKey].items[itemsindex].images.splice(imgindex, 1);
                _this.setData({
                    dataList: _this.data.dataList,
                });
                console.log(_this.data.dataList[navKey]);
            }
        });
    },
    // 上传顶部banner图片
    uploadBannerImg(e) {
        var _this = this;
        var navKey = _this.data.navKey; //页面索引
        app.chooseImage({
            success: function (ret) {
                // console.log(ret.data.tempFilePaths);
                _this.data.dataList[navKey].banner = ret.data.tempFilePaths[0];
                _this.data.dataList[navKey].bannerIsShow = true;
                _this.setData({
                    dataList: _this.data.dataList
                });
            }
        });
    },
    // 页面中类型、发布分类按钮切换
    typeBtnChange(e) {
        var _this = this;
        var navKey = _this.data.navKey; //页面索引
        _this.data.dataList[navKey].typeBtnIndex = e.target.dataset.key;
        _this.setData({
            dataList: _this.data.dataList
        });
    },
    // 好餐馆发布提交
    submit() {
        var _this = this;
        var navKey = _this.data.navKey;
        // 将输入的文字添加到数据列表并清空inputText文本存储变量
        _this.addText();
        _this.data.dataList[navKey].inputText = "";
        _this.setData({
            dataList: _this.data.dataList,
        });
        console.log(_this.data.dataList[navKey]);
    }
})