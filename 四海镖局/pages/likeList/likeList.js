// pages/collectList/collectList.js
var WxParse = require('../../wxParse/wxParse.js');
//接口
var prot = require('../../utils/prot.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: prot.api,
    reserveListData: [],
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
  },
  //服务商点击
  serviceListClick: function (obj) {
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var name_ = obj.target.dataset.name || obj.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../serviceDetails/serviceDetails?state=1&merchantId=' + code_ + '&merchantName=' + name_
    })
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
        wx.showLoading({
          title: '加载中...',
        })
        vm.getUserCollect(vm.data.userKey, value.code);
      }
    })
    this.setData({
      reserveNavData: this.data.reserveNavData
    });
  },
  //获取收藏点赞数据
  getUserCollect: function (key, code) {
    var vm = this;
    //收藏数据
    wx.request({
      url: prot.GetCollectListPage,
      method: 'GET',
      data: {
        args: {
          start: 0,
          limit: 10,
          sort: 'A.CreatedDate',
          dir: 'DESC',
          SourceCode: code
        },
        WeSessionKey: key
      },
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          data.result.forEach(function (value, index) {
            if (value.Merchant.PicUrl && value.Merchant.PicUrl != null) {
              value.Merchant.PicUrl = vm.data.api + value.Merchant.PicUrl;
            } else {
              value.Merchant.PicUrl = '/images/imgNull.png';
            }
            var merchantId = value.Merchant.MerchantID;
            var introduce = value.Merchant.Introduce;
            var nodes = WxParse.wxParse('introduce' + index, 'html', introduce, vm, 5);
            data.result[index].Merchant['nodes'] = nodes;
          });
          vm.setData({
            userCollectData: data.result,
          });
        }
      }
    });
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
    var vm = this;
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        vm.setData({
          userKey: res.data.key
        });
        vm.getUserCollect(res.data.key, 'Merchant');
      }
    });
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