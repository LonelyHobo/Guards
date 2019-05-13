// pages/appointment/appointment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceName: "",
    serviceArea: "",
    serviceTitle: "",
    introduceNavData:[
      { title:'国内服务',code:'1',on:'on',datalist:[
        { title: "私人保镖", code: '1', describe: "处理一般突发安全威胁或安全伤害事件，进行人身安全保护", url:"/images/service_list1.jpg"},
        { title: "私人保镖", code: '1', describe: "处理一般突发安全威胁或安全伤害事件，进行人身安全保护", url: "/images/service_list1.jpg" }
      ]},
      {
        title: '海外服务', code: '2', on: '', datalist: [
          { title: "海外保镖", code: '1', describe: "处理一般突发安全威胁或安全伤害事件，进行人身安全保护", url: "/images/service_list1.jpg" },
          { title: "海外保镖", code: '1', describe: "处理一般突发安全威胁或安全伤害事件，进行人身安全保护", url: "/images/service_list1.jpg" }
        ]},
    ],
    introduceListData:[
      { title: "私人保镖", code: '1', describe: "处理一般突发安全威胁或安全伤害事件，进行人身安全保护", url: "/images/service_list1.jpg" },
      { title: "私人保镖", code: '1', describe: "处理一般突发安全威胁或安全伤害事件，进行人身安全保护", url: "/images/service_list1.jpg" }
    ],
  },
  introduceListClick: function (obj){
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var name_ = this.data.serviceName;
    var area_ = '中国/香港';
    var title_ = obj.target.dataset.title || obj.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../appointment/appointment?code=' + code_ + '&name=' + name_ + '&area=' + area_ + '&title=' + title_
    })
  },
  introduceNavClick: function (obj){
    var the = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.introduceNavData.forEach(function (value, index) {
      value.on = '';
      if (value.code == code_) {
        the.data.introduceNavData[index].on = 'on';
        datalist = the.data.introduceNavData[index].datalist
      }
    })
    this.setData({ introduceNavData: this.data.introduceNavData, introduceListData: datalist });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ serviceName: options.name});

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