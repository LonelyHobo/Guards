// pages/appointment/appointment.js
var provinces = require('../../utils/province.js');
var prot = require('../../utils/prot.js');
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api:prot.api,
    serviceName: "",
    serviceArea: "",
    serviceTitle: "",
    serviceId:[],
    streamerData:[],
    areaCode:1,
    serviceData:{
    },
    state:1,
    fwsData: [], 
    reserveNavData: [
      { title: '国内服务', code: '1', on: 'on' },
      { title: '海外服务', code: '2', on: '' }
    ],
    serviceNavMinData: [
      { title: '国内', code: '1', on: 'on' },
      { title: '海外', code: '2', on: '' }
    ],
    serviceNavData: [
      { title: '服务地区', code: '1', icon: 'icon-xia1', on: '' },
      { title: '特色服务', code: '2', icon: 'icon-xia1', on: '' }
    ],
    featureData: [
      { title: '物资押运', code: '0', on: '' },
      { title: '私人保镖', code: '1', on: '' },
      { title: '警卫派驻', code: '2', on: '' },
      { title: '接送机礼遇', code: '3', on: '' },
    ],
    serviceAreaData: [],
    serviceAreaMinData: [],
  },
  //服务地区是否国内选择
  serviceNavMinClick: function (obj) {
    var vm = this;
    var serviceAreaDatas = [];
    var regionID = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.serviceNavMinData.forEach(function (value, index) {
      value.on = '';
      if (value.regionID == regionID) {
        value.on = 'on';
        if (regionID == '1') {
          serviceAreaDatas = vm.data.serviceAreaData1;
        } else {
          serviceAreaDatas = vm.data.serviceAreaData2;
        }
      }
    });
    this.setData({
      serviceNavMinData: this.data.serviceNavMinData,
      serviceAreaData: serviceAreaDatas,
      serviceAreaMinData: serviceAreaDatas[0].datalist
    });
  },
  //服务地区选择
  serviceAreaMinClick: function (obj) {
    var vm = this;
    var on_ = '';
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.data.serviceAreaMinData.forEach(function (value, index) {
      if (value.code == code_) {
        value.on = value.on == 'on' ? '' : 'on';
        on_ = value.on;
        var codes = value.code;
        var judge = true;
        vm.data.serviceAreaCheckedData = value;
      } else {
        value.on = '';
      }
    });
    this.data.serviceNavData.forEach(function (value, index) {
      value.on = '';
      value.icon = 'icon-xia1';
      if (value.code == '1') {
        value.check = on_ == 'on' ? 'check' : ''
      }
    });
    this.setData({ serviceAreaMinData: this.data.serviceAreaMinData, serviceAreaCheckedData: vm.data.serviceAreaCheckedData, serviceNavTop: 'top', serviceNavData: this.data.serviceNavData });
  },
  //服务地区省选择
  serviceAreaClick: function (obj) {
    var vm = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.serviceAreaData.forEach(function (value, index) {
      value.on = '';
      if (value.code == code_) {
        vm.data.serviceAreaData[index].on = 'on';
        datalist = vm.data.serviceAreaData[index].datalist;
      }
    })
    this.setData({ serviceAreaData: this.data.serviceAreaData, serviceAreaMinData: datalist });
  },
  featureClick: function (obj) {
    var vm = this;
    var on_ = '';
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.data.featureData.forEach(function (value, index) {
      if (value.code == code_) {
        value.on = value.on == 'on' ? '' : 'on';
        on_ = value.on;
      } else {
        value.on = '';
      }
    })
    this.data.serviceNavData.forEach(function (value, index) {
      value.on = '';
      value.icon = 'icon-xia1';
      if (value.code == '2') {
        value.check = on_ == 'on' ? 'check' : ''
      }
    });
    this.setData({ featureData: this.data.featureData, featureTop: 'top', serviceNavData: this.data.serviceNavData });
  },
  //服务地区 特色服务
  serviceNavClick: function (obj) {
    var vm = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.data.serviceNavData.forEach(function (value, index) {
      if (value.code == code_) {
        vm.data.serviceNavData[index].on = vm.data.serviceNavData[index].on == 'on' ? '' : 'on';
        vm.data.serviceNavData[index].icon = vm.data.serviceNavData[index].icon == 'icon-xia1' ? 'icon-shang' : 'icon-xia1';
        if (code_ == '1') {
          vm.data.featureTop = 'top';
          vm.data.serviceNavTop = vm.data.serviceNavData[index].on == 'on' ? 'bottom' : 'top';
        } else {
          vm.data.serviceNavTop = 'top';
          vm.data.featureTop = vm.data.serviceNavData[index].on == 'on' ? 'bottom' : 'top';
        }
      } else {
        value.on = '';
        value.icon = 'icon-xia1';
      }
    });
    if (code_ == '1') {
      this.setData({ serviceNavData: this.data.serviceNavData, serviceNavTop: vm.data.serviceNavTop, featureTop: vm.data.featureTop });
    } else {
      this.setData({ serviceNavData: this.data.serviceNavData, serviceNavTop: vm.data.serviceNavTop, featureTop: vm.data.featureTop });
    }
  },
  //服务商点击
  fwsClick: function (obj) {
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var title_ = obj.target.dataset.title || obj.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../serviceDetails/serviceDetails?merchantId=' + code_ + '&merchantName=' + title_
    })
  },
  yuyue:function(){
    wx.navigateTo({
      url: '../reserveDetails2/reserveDetails2?title=' + this.data.serviceTitle + '&areaCode=' + this.data.areaCode + '&code=' + this.data.serviceId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm = this;
    this.setData({ serviceTitle: options.title, state: options.state, serviceId: options.code, areaCode: options.areaCode });
    var serviceAreaDatas = [];
    provinces.province.forEach(function (value, index) {
      var datalist = [];
      var index_ = index;
      value.citys.forEach(function (value, index) {
        datalist.push({ title: value.citysName, code: index_ + '_' + index, on: '' });
      })
      serviceAreaDatas.push({ title: value.provinceName, code: index, on: (index == 0 ? 'on' : ''), datalist: datalist });
    })
    this.setData({ serviceAreaData: serviceAreaDatas, serviceAreaMinData: serviceAreaDatas[0].datalist });
    wx.request({
      url: prot.GetServiceDetail,
      method: 'GET',
      data: {
        id: options.code,
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          data.Plist = data.Plist ? data.Plist : [{ PicId: '', PicUrl:'/images/banner1_1.png'}];
          vm.setData({ serviceData:data });
          var introduce = data.Introduce;
          WxParse.wxParse('introduce', 'html', introduce, vm, 5);
        }
      }
    }); 
    //热推服务商
    wx.request({
      url: prot.GetMerchantListPageByService,
      method: 'GET',
      data: {
        args: {
          start: 0,
          limit: 10,
          sort: 'A.SortNo',
          dir: 'DESC', 
          SpecialID: options.code,
          RegionID: options.areaCode == 1 ? 0 : 1519
        }
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          data.forEach(function (value, index) {
            value.PicUrl = vm.data.api + value.PicUrl;
          });
          vm.setData({ fwsData: data });
        }
      }
    });
    //下面的轮播
    wx.request({
      url: prot.GetDetailBannerListPage,
      method: 'GET',
      data: {
        args: {
          start: 0,
          limit: 10,
          sort: 'SortNo',
          dir: 'DESC',
          NavCode: 'DetailBanner'
        }
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          data.forEach(function (value, index) {
            value.PicUrl = vm.data.api + value.PicUrl;
          });
          vm.setData({ streamerData: data });
        }
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