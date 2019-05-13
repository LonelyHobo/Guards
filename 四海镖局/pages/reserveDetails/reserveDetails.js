// pages/appointment/appointment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceName: "",
    serviceArea: "",
    serviceTitle: "",
    fwsData: [
      { title: '北京万家', url: '/images/icon_index_list_1.png', code: '001' },
      { title: '香港卫安', url: '/images/icon_index_list_2.png', code: '002' },
    ],
  },
  //服务商点击
  fwsClick: function (obj) {
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var title_ = obj.target.dataset.title || obj.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../serviceDetails/serviceDetails?code=' + code_ + '&name=' + title_
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ serviceName: options.name });

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