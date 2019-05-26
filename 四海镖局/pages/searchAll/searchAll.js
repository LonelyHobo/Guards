// pages/searchAll/searchAll.js
var WxParse = require('../../wxParse/wxParse.js');
//接口
var prot = require('../../utils/prot.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api:prot.api,
    searchVal:'',
    reserveListData:[],
    isNull:false,
    reserveNavData: [{
      title: '服务商',
      code: 'Merchant',
      on: 'on'
    },
    {
      title: '服务',
      code: 'Service',
      on: ''
    }
    ],
    userCollectData1:[],
    userCollectData2:[]
  },
  //服务分类选择
  reserveNavDataClick: function (obj) {
    var vm = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.reserveNavData.forEach(function (value, index) {
      value.on = '';
      if (value.code == code_) {
        value.on = 'on';
      }
    })
    this.setData({
      reserveNavData: this.data.reserveNavData
    });
  },
  //服务商点击
  serviceListClick: function (obj) {
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var name_ = obj.target.dataset.name || obj.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../serviceDetails/serviceDetails?state=1&merchantId=' + code_ + '&merchantName=' + name_
    })
  },
  //服务列表点击
  reserveListDataClick: function (obj) {
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var name_ = obj.target.dataset.name || obj.currentTarget.dataset.name;
    var title_ = obj.target.dataset.title || obj.currentTarget.dataset.title;
    var areaCode = 0;
    wx.navigateTo({
      url: '../reserveDetails/reserveDetails?state=1&code=' + code_ + '&name=' + name_ + '&title=' + title_ + '&areaCode=' + areaCode
    })
  },
  searchClick:function(code){
    var vm = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: prot.Search,
      method: 'GET',
      data: {
        args: {
          start: 0,
          limit: 10,
          sort: 'SortNo',
          dir: 'DESC',
          Name: vm.data.searchVal
        }
      },
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          data.merchats.forEach(function (value, index) {
            if (value.PicUrl && value.PicUrl != null) {
              value.PicUrl = vm.data.api + value.PicUrl;
            } else {
              value.PicUrl = '/images/imgNull.png';
            }
            var introduce = value.Introduce;
            var nodes = WxParse.wxParse('introduce1' + index, 'html', introduce, vm, 5);
            data.merchats[index]['nodes'] = nodes;
          });
          data.services.forEach(function (value, index) {
            if (value.PicUrl && value.PicUrl != null) {
              value.PicUrl = vm.data.api + value.PicUrl;
            } else {
              value.PicUrl = '/images/imgNull.png';
            }
            var introduce = value.Introduce;
            var nodes = WxParse.wxParse('introduce2' + index, 'html', introduce, vm, 5);
            data.services[index]['nodes'] = nodes;
          });
          vm.setData({
            userCollectData1: data.merchats,
            userCollectData2: data.services,
          });
        }
      }
    });
  },
  searchInput:function(obj){
    this.setData({
      searchVal: obj.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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