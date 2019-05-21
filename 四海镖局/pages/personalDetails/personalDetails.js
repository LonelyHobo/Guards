// pages/personalDetails/personalDetails.js
//获取应用实例
const app = getApp();
var wxLocation = require('../../utils/wxLocation.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      gender: '-1',
      nickName: '...',
      winShow:'',
      avatarUrl: '/images/icon_top.png',
      city: '...',
      province: '...',
    },
    userDetailsData: {
      birthday: '待完善',
      tel: '待完善',
    },
    locations: '... ...',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'), 

  },
  //退出登陆
  loginout:function(obj){
    app.globalData.userInfo = null;
    wx.navigateTo({
      url: '../index/index'
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getPhoneNumber(e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var vw = this;
    wx.getStorage({      
      key: 'userdata',
        success: function(res) {
        vw.setData({
          userInfo: res.data
        })      
      }    
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