var rootDocment = 'https://xlc.yamivip.com/api/';
var sgin = require('md5.js');
var openid = false;

function checkToken() {
  var pages = getCurrentPages();
  var Page = pages[pages.length - 1];//当前页
  var url = Page.route; //当前页面url
  var options = Page.options;
  var str = '';
  for (let k in options) {
    str += k + '=' + options[k] + '&'
  }
  str = str ? encodeURIComponent(str.substr(0, str.length - 1)) : '';
  var userinfo = wx.getStorageSync('open_id');
  if (!userinfo) {
    wx.reLaunch({
      url: '/pages/getUserCode/getUserCode?url=' + JSON.stringify(url) + '&options=' + str
    });
    return;
  }
};

//post数据请求
function postData(url, data, cb) {
  checkToken()
    wx.request({
      url: rootDocment + url,
      data: data,
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        // console.log(JSON.stringify(res));
        if (res.data.status == 1000)
        {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        else{
          return typeof cb == "function" && cb(res.data)
        }        
      },
      fail: function () {
        return typeof cb == "function" && cb(false)
      }
    })
  }

//get数据请求
function getData(url, data, cb) {
  checkToken()
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'get',
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

//其中module.exports是将req方法暴露出去使得别的文件中可以使用该方法，由于js函数是异步执行的，所以return 的是回调函数，而不是具体的数据
module.exports = {
  postData: postData,
  getData: getData
}  