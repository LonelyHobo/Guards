// pages/appointment/appointment.js
//接口
var prot = require('../../utils/prot.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceName: "",
    serviceArea: "",
    serviceTitle: "",
    userInfo:{
      Phone:'',
    },
    remark:'',
    codei:0,
    agreementTop: 'bottom',
    isAgreement: false,
    userKey:'',
    getcodename: '获取验证码',
    getcodenamecolor: '#3d4bf6',
    setcode: '',
    firmcode: '',
  },
  //绑定手机号
  phoneChange:function(){
    wx.navigateTo({
      url: '../changePhone/changePhone?state=1'
    });
  },
  //获取验证码
  getCode: function () {
    var vm = this;
    if (vm.data.getcodename != '获取验证码') {
      return false;
    }
    if (vm.data.userInfo.Phone == '' || vm.data.userInfo.Phone==null) {
      wx.showToast({
        title: '请先绑定手机号',
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
  submitForm:function(){
    var vm = this;
    if (vm.data.userInfo.Phone == '' || vm.data.userInfo.Phone == null) {
      wx.showToast({
        title: '请先绑定手机号',
        mask: false,
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else if (vm.data.setcode == '') {
      wx.showToast({
        title: '请先获取验证码',
        mask: false,
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else if (vm.data.firmcode == '') {
      wx.showToast({
        title: '请输入验证码',
        mask: false,
        icon: 'none',
        duration: 1000,
      });
      return false;
    } else if (vm.data.setcode != vm.data.firmcode) {
      wx.showToast({
        title: '验证码错误',
        mask: false,
        icon: 'none',
        duration: 1000,
      });
      return false;
    }
    var data={
      ServiceID: vm.data.serviceId,
      MerchantID: vm.data.merchantId,
      RegionID: vm.data.areaCode,
      Phone: vm.data.userInfo.Phone,
      Content: vm.data.remark,
    }
    wx.showLoading({
      title: '正在提交...',
    });
    wx.request({
      url: prot.OrderSave + '?WeSessionKey=' + vm.data.userKey,
      method: 'POST',
      data: JSON.stringify(data),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          wx.showToast({
            title: '提交成功！',
            mask: true,
            icon: 'success',
            duration:2000,
            success:function(){
              wx.redirectTo({
                url: '../index/index?route=orderform'
              });
            }
          });
        }else{
          wx.showToast({
            title: '提交失败！',
            mask: true,
            icon: 'none',
            duration: 2000,
          });
        }
      }
    });
  },
  agreementClick: function() {
    this.setData({
      agreementTop: this.data.agreementTop == 'bottom' ? 'top' : 'bottom'
    });
  },
  checkClick: function() {
    this.setData({
      isAgreement: !this.data.isAgreement
    });
  },
  appointementSave:function(obj){
    var val = obj.detail.value;
    this.setData({
      remark: val
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
  onLoad: function(options) {
    var vm = this;
    this.setData({
      serviceId: options.serviceId,//服务id
      merchantName: options.merchantName,//服务商名称
      merchantId: options.merchantId,//服务商id
      areaCode: options.areaCode,//地区id
      areaName: options.areaName,//地区名称
      serviceName: options.serviceName,//服务名称
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var vm = this;
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        vm.setData({
          userKey: res.data.key,//用户key
        });
      }
    });
    wx.getStorage({
      key: 'userdata',
      success: function (res) {
        vm.setData({
          userInfo: res.data,//用户key
        });
      }
    });
    //清空验证码
    vm.setData({
      setcode: ''
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})