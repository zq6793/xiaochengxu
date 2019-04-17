
// var serverUrl = ""; //接口域名（正式）
var serverUrl = "http://chanmao.yamivip.cn/api/"; //接口域名（测试）


// 打开新页面
function openWin(url) {
    wx.navigateTo({
        url: url
    })
}
//返回上一页
function back(){
    wx.navigateBack();
}

/***判断字符串是否为空
    @param {string} str 变量
    @example: var $cui = new cui(); $cui.isDefine("变量");
*/
function isDefine(str){
    if (str == null || str == "" || str == "undefined" || str == undefined || str == "null" || str == "(null)" || str == 'NULL' || typeof (str) == 'undefined') {
        return false;
    }
    else {
        str = str + "";
        str = str.replace(/\s/g, "");
        if (str == "") {
            return false;
        }
        return true;
    }
}

/***loading 加载弹窗
 *  @title {string} 提示内容
 *  @mask {bool} 是否显示透明蒙层，防止触摸穿透
 *  @showTime {number} 显示时间，设置后当达到设定时间自定关闭加载弹窗
 */
function showLoad({title = '', mask = true, showTime}, callback){
    wx.showLoading({
        title: title,
        mask: mask
    });
    if (isDefine(showTime))
    {
        var timer = setTimeout(() => {
            clearTimeout(timer);
            wx.hideLoading();
        }, showTime);
    }
    isDefine(callback) ? callback() : '';
}

//关闭加载弹窗
function hideLoad(){
    wx.hideLoading();
}

/***toast 弹出消息提示窗
 * @title {string} 提示的内容
 * @icon {string} 'success': 成功图标 | 'loading': 加载图标 | 'none': 不显示图标
 * @image {string} image 自定义图标的本地路径，image 的优先级高于 icon
 * @mask {bool} 是否显示透明蒙层，防止触摸穿透
 * @showtime {number} 显示时长
 */
function toast({title = '', icon = "none", image = '', mask = false, showtime = 2000}){
    wx.showToast({
        title: title,
        icon: icon,
        image: image,
        mask: mask,
        duration: showtime
    })
}

/*** dialog 模态对话弹窗
 *  @title {string} 标题
 *  @content {string} 提示内容
 *  @showCancel {bool} 是否显示取消按钮
 *  @cancelText {string} 取消按钮文字，默认"取消"
 *  @cancelColor {string} 取消按钮的文字颜色，必须是 16 进制格式的颜色字符串
 *  @confirmText {string} 确认按钮的文字，最多 4 个字符
 *  @confirmColor {string} 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
 *  @callback {fn} 点击按钮回调 confirm按钮返回 index = 1, cancel按钮返回 index = 0
 */
function dialog({title = ' ', content = '', showCancel = true, cancelText = '取消', cancelColor = '#646464', confirmText = '确定', confirmColor = '576B95'}, callback){
    wx.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        cancelText: cancelText,
        cancelColor: cancelColor,
        confirmText: confirmText,
        confirmColor: confirmColor,
        success(res) {
            if (res.confirm) {
                // console.log('用户点击确定')
                isDefine(callback) ? callback({index: 1}) : '';
            } else if (res.cancel) {
                // console.log('用户点击取消')
                isDefine(callback) ? callback({ index: 0}) : '';
            }
        }
    })
}

/*** actionSheet操作菜单
 *  @itemList {arr}  按钮的文字数组，数组长度最大为 6
 *  @imteColor {string} 按钮的文字颜色
 */
function actionSheet({itemList = [''], itemColor = "#333"},callback){
    wx.showActionSheet({
        itemList: itemList,
        itemColor: itemColor,
        success: function(ret){
            isDefine(callback) ? callback({index: ret.tapIndex + 1}) : '';
        },
        fail: function(ret){
            isDefine(callback) ? callback({ index: 0}) : '';
        }
    })
}

//ajax数据请求
function ajax({url, type = "post", data = {}, success, error}) {
    switch (type){
        case "post": case "POST":
            var header = { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'secret': wx.getStorageSync('token')
            };
            break;
        case "get": case "GET":
            var header = { 'secret': wx.getStorageSync('token')};
            break;
        default:
            var header = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'secret': wx.getStorageSync('token')
            };
            break;
    }
    wx.request({
        url: serverUrl + url,
        data: data,
        method: type,
        header: header,
        success: function (ret) {
            // console.log(JSON.stringify(ret));
            if (ret.data.status == 1000) {
                toast({title: ret.data.msg})
                return false;
            }
            else if (ret.statusCode == 404)
            {                
                toast({title: "数据请求地址未找到"})
            }
            else {
                return typeof success == "function" && success(ret.data)
            }
        },
        fail: function () {
            return typeof error == "function" && error(false)
        }
    })
}

/*上传文件
    @param {string} filePath 要上传文件资源的路径
    @param {string} fileName 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
    @param {object} data HTTP 请求中其他额外的 form data
*/
function uploadFile({ url, filePath, fileName, data = {}, success, error }){
    wx.uploadFile({
        url: serverUrl + url,
        header: {'secret': wx.getStorageSync('token') },
        filePath: filePath,
        name: fileName,
        formData: data,
        success: function (ret) {
            // console.log(JSON.stringify(ret));
            if (ret.data.status == 1000) {
                toast({ title: ret.data.msg })
                return false;
            }
            else if (ret.statusCode == 404) {
                toast({ title: "数据请求地址未找到" })
            }
            else {
                return typeof success == "function" && success(ret)
            }
        },
        fail: function (res) {
            console.log(res);
            return typeof error == "function" && error(false)
        }
    });
}

//选择图片
function chooseImage({success, error}){
    actionSheet({
        itemList: ["从相册选择", "拍照"]
    }, function (ret) {
        // console.log(ret.index);        
        if(ret.index != 0)
        {
            switch (ret.index) {
                case 1: //从相册选择
                    var sourceType = ['album'];
                    break;
                case 2: //拍照
                    var sourceType = ['camera'];
                    break;
            }
            wx.chooseImage({
                count: 9, // 最多可以选择的图片张数，默认9
                sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
                sourceType: sourceType, // album 从相册选图，camera 使用相机，默认二者都有
                success: function (res) {
                    // success
                    // console.log(res)
                    isDefine(success) ? success({ data: res }) : '';
                },
                fail: function () {
                    // fail
                    isDefine(error) ? error() : '';
                },
                complete: function () {
                    // complete
                }
            })
        }
        
    });
}

module.exports = {
    serverUrl: serverUrl,
    openWin: openWin,
    back: back,
    isDefine: isDefine,
    ajax: ajax,
    uploadFile: uploadFile,
    showLoad: showLoad,
    hideLoad: hideLoad,
    toast: toast,
    dialog: dialog,
    actionSheet: actionSheet,
    chooseImage: chooseImage
}
