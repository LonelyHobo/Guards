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
    phoneCode:'15073231615',
    remark:'',
    codei:0,
    agreementTop: 'bottom',
    isAgreement: false,
  },
  submitForm:function(){
    var vm = this;
    var args={
      ServiceID: vm.data.serviceId,
      MerchantID: vm.data.merchantId,
      RegionID: vm.data.areaCode,
      Phone: vm.data.phoneCode,
      Content: vm.data.remark
    }
    wx.showToast({
      title: '正在提交...',
      mask: true,
      icon: 'loading'
    })
    wx.request({
      url: prot.OrderSave,
      method: 'POST',
      data: {
        args: args
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
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
  getCode:function(){
    //获取手机验证码
    wx.showToast({
      title: '此服务暂未开通！',
      mask: true,
      icon: 'success'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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