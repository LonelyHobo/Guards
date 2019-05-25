// pages/personalDetails/personalDetails.js
//获取应用实例

var util = require('../../utils/util.js');
const app = getApp();
var wxLocation = require('../../utils/wxLocation.js');
//接口
var prot = require('../../utils/prot.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: prot.api,
    userInfo: {
      Phone: '',
    },
    userKey: '',
    getcodename:'获取验证码',
    getcodenamecolor:'#3d4bf6',
    setcode:'',
    firmcode:'',
  },
  editPhone:function(){
    var vm = this;
    if (vm.data.setcode == vm.data.firmcode && vm.data.firmcode != '' && vm.data.userInfo.Phone!=''){
      wx.showLoading({
        title: '保存中...',
      });
      var data= {
        Phone: vm.data.userInfo.Phone
      }
      wx.request({
        url: prot.PhoneChange + '?WeSessionKey=' + vm.data.userKey,
        method: 'POST',
        data: JSON.stringify(data),
        success: function (res) {
          wx.hideLoading();
          if (res.statusCode == 200) {
            var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
            wx.showToast({
              title: '保存成功',
              mask: true,
              icon: 'success',
              duration: 2000,
            });
            var userInfo = wx.getStorageSync("userdata");
            userInfo.Phone = vm.data.userInfo.Phone;
            wx.setStorage({
              key: 'userdata',
              data: userInfo,
              success:function(){
                wx.navigateBack({
                  delta: 1
                });
              }
            });
          } else {
            wx.showToast({
              title: '保存失败',
              mask: true,
              icon: 'none',
              duration: 2000,
            });
          }
        }
      });
    } else if (vm.data.setcode == ''){
      wx.showToast({
        title: '请先获取验证码',
        mask: false,
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else if (vm.data.userInfo.Phone == '') {
      wx.showToast({
        title: '请输入手机号码',
        mask: false,
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else if (vm.data.firmcode==''){
      wx.showToast({
        title: '请输入验证码',
        mask: false,
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else if (vm.data.setcode != vm.data.firmcode){
      wx.showToast({
        title: '验证码错误',
        mask: false,
        icon: 'none',
        duration: 1000,
      });
      return false;
    }
  },
  //获取验证码
  getCode:function(){
    var vm = this;
    if (vm.data.getcodename != '获取验证码'){
      return false;
    }
    if (vm.data.userInfo.Phone == ''){
      wx.showToast({
        title: '请输入手机号',
        mask: false,
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else if (!/^1[34578]\d{9}$/.test(vm.data.userInfo.Phone)){
      wx.showToast({
        title: '请输入有效的手机号码',
        mask: false,
        icon: 'none',
        duration: 1000,
      });
      return false;
    }
    wx.showLoading({
      title: '获取中...',
    });
    wx.request({
      url: prot.GetAuthCode + '?WeSessionKey=' + vm.data.userKey + '&Phone=' + vm.data.userInfo.Phone,
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          vm.data.getcodename = '60s后重新获取';
          vm.data.getcodenamecolor = '#999999';
          vm.setData({
            getcodenamecolor: vm.data.getcodenamecolor,
            getcodename: vm.data.getcodename,
            setcode: data.result,
          });
          var i = 59;
          var codeTime = setInterval(function () {
            i--;
            if (i == 0) {
              vm.data.getcodename = '获取验证码';
              vm.data.getcodenamecolor = '#3d4bf6';
              clearInterval(codeTime);
            } else {
              vm.data.getcodename = i + 's后重新获取';
            }
            vm.setData({
              getcodenamecolor: vm.data.getcodenamecolor,
              getcodename: vm.data.getcodename
            });
          }, 1000)
        } else {
          wx.showToast({
            title: '获取失败',
            mask: true,
            icon: 'none',
            duration: 2000,
          });
        }
      }
    });
  },
  firmInput: function (obj) {
    var vm = this;
    vm.data.setcode='';
    vm.data.userInfo.Phone = obj.detail.value;
    vm.setData({
      userInfo: vm.data.userInfo,
      setcode: vm.data.setcode
    });
  },
  firmCode: function (obj) {
    var vm = this;
    vm.data.firmcode = obj.detail.value;
    vm.setData({
      firmcode: vm.data.firmcode
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm = this;
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        vm.setData({
          userKey: res.data.key
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})