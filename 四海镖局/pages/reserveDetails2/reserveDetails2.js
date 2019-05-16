// pages/appointment/appointment.js
var provinces = require('../../utils/province.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceName: "",
    serviceArea: "",
    serviceTitle: "",
    serviceData: [
      { title: '香港卫安', url: '/images/icon_list_2.jpg', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何', label: '特色标签：私人保镖', code: '001' },
      { title: '北京万家', url: '/images/icon_list_3.jpg', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何', label: '特色标签：私人保镖', code: '002' },
      { title: '上海永安', url: '/images/icon_list_2.jpg', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何', label: '特色标签：私人保镖', code: '003' }
    ],
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
  //服务商点击
  serviceListClick: function (obj) {
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var name_ = obj.target.dataset.name || obj.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../serviceDetails/serviceDetails?code=' + code_ + '&name=' + name_
    })
  },
  //服务地区是否国内选择
  serviceNavMinClick: function (obj) {
    var the = this;
    var serviceAreaDatas = [];
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.serviceNavMinData.forEach(function (value, index) {
      value.on = '';
      if (value.code == code_) {
        value.on = 'on';
        var province_ = [];
        if (code_ == '1') {
          province_ = provinces.province;
        } else {
          province_ = [{
            "citys": [
              {
                "citysName": "1区",
              }, {
                "citysName": "2区",
              }, {
                "citysName": "3区",
              },
            ],
            "provinceName": "海外某州"
          }];
        }
        province_.forEach(function (value, index) {
          var datalist = [];
          var index_ = index;
          value.citys.forEach(function (value, index) {
            datalist.push({ title: value.citysName, code: index_ + '_' + index, on: '' });
          })
          serviceAreaDatas.push({ title: value.provinceName, code: index, on: (index == 0 ? 'on' : ''), datalist: datalist });
        })
      }
    })
    this.setData({ serviceNavMinData: this.data.serviceNavMinData, serviceAreaData: serviceAreaDatas, serviceAreaMinData: serviceAreaDatas[0].datalist });
  },
  //服务地区选择
  serviceAreaMinClick: function (obj) {
    var the = this;
    var on_ = '';
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.data.serviceAreaMinData.forEach(function (value, index) {
      if (value.code == code_) {
        value.on = value.on == 'on' ? '' : 'on';
        on_ = value.on;
        var codes = value.code;
        var judge = true;
        the.data.serviceAreaCheckedData = value;
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
    this.setData({ serviceAreaMinData: this.data.serviceAreaMinData, serviceAreaCheckedData: the.data.serviceAreaCheckedData, serviceNavTop: 'top', serviceNavData: this.data.serviceNavData });
  },
  //服务地区省选择
  serviceAreaClick: function (obj) {
    var the = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.serviceAreaData.forEach(function (value, index) {
      value.on = '';
      if (value.code == code_) {
        the.data.serviceAreaData[index].on = 'on';
        datalist = the.data.serviceAreaData[index].datalist;
      }
    })
    this.setData({ serviceAreaData: this.data.serviceAreaData, serviceAreaMinData: datalist });
  },
  featureClick: function (obj) {
    var the = this;
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
    var the = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.data.serviceNavData.forEach(function (value, index) {
      if (value.code == code_) {
        the.data.serviceNavData[index].on = the.data.serviceNavData[index].on == 'on' ? '' : 'on';
        the.data.serviceNavData[index].icon = the.data.serviceNavData[index].icon == 'icon-xia1' ? 'icon-shang' : 'icon-xia1';
        if (code_ == '1') {
          the.data.featureTop = 'top';
          the.data.serviceNavTop = the.data.serviceNavData[index].on == 'on' ? 'bottom' : 'top';
        } else {
          the.data.serviceNavTop = 'top';
          the.data.featureTop = the.data.serviceNavData[index].on == 'on' ? 'bottom' : 'top';
        }
      } else {
        value.on = '';
        value.icon = 'icon-xia1';
      }
    });
    if (code_ == '1') {
      this.setData({ serviceNavData: this.data.serviceNavData, serviceNavTop: the.data.serviceNavTop, featureTop: the.data.featureTop });
    } else {
      this.setData({ serviceNavData: this.data.serviceNavData, serviceNavTop: the.data.serviceNavTop, featureTop: the.data.featureTop });
    }
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
    this.setData({ serviceTitle: options.title });
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