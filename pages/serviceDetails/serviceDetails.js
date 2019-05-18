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
    state:1,
    serviceNavTop:'top',
    serviceAreaMinData: [],
    serviceAreaCheckedData: [],
    serviceCode:'',
    serviceNavMinData: [
      { title: '国内', code: '1', on: 'on' },
      { title: '海外', code: '2', on: '' }
    ],
    serviceAreaData: [],
    introduceNavData:[
      { title:'国内服务',code:'1',on:'on',datalist:[
        { title: "私人保镖", code: '1', describe: "处理一般突发安全威胁或安全伤害事件，进行人身安全保护", url:"/images/service_list1.jpg"},
        { title: "私人保镖", code: '2', describe: "处理一般突发安全威胁或安全伤害事件，进行人身安全保护", url: "/images/service_list1.jpg" }
      ]},
      {
        title: '海外服务', code: '2', on: '', datalist: [
          { title: "海外保镖", code: '1', describe: "处理一般突发安全威胁或安全伤害事件，进行人身安全保护", url: "/images/service_list1.jpg" },
          { title: "海外保镖", code: '2', describe: "处理一般突发安全威胁或安全伤害事件，进行人身安全保护", url: "/images/service_list1.jpg" }
        ]},
    ],
    introduceListData:[
      { title: "私人保镖", code: '1', describe: "处理一般突发安全威胁或安全伤害事件，进行人身安全保护", url: "/images/service_list1.jpg" },
      { title: "私人保镖", code: '2', describe: "处理一般突发安全威胁或安全伤害事件，进行人身安全保护", url: "/images/service_list1.jpg" }
    ],
  },
  introduceListClick: function (obj){
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var name_ = this.data.serviceName;
    var area_ = '中国/香港';
    var is_ = false;
    var title_ = obj.target.dataset.title || obj.currentTarget.dataset.title;
    this.data.introduceListData.forEach(function (value) {
      if (value.code == code_ && !value.city) {
        is_=true;
      }
    });
    if (is_){
      wx.showToast({
        title: '请先选择服务地区',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.navigateTo({
      url: '../appointment/appointment?code=' + code_ + '&name=' + name_ + '&area=' + area_ + '&title=' + title_
    })
  },
  appointmentBtn: function (obj){
    var code_ = '';
    var name_ = this.data.serviceName;
    var area_ = '中国/香港';
    wx.navigateTo({
      url: '../appointment/appointment?code=' + code_ + '&name=' + name_ + '&area=' + area_
    })
  },
  introduceListClick2: function (obj) {
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.setData({ serviceNavTop: 'bottom', serviceCode: code_ });
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
    this.data.introduceListData.forEach(function(value){
      if (value.code == the.data.serviceCode){
        value.city = the.data.serviceAreaCheckedData.title;
      }
    });
    this.setData({ serviceAreaMinData: this.data.serviceAreaMinData, serviceAreaCheckedData: the.data.serviceAreaCheckedData, serviceNavTop: 'top', introduceListData:this.data.introduceListData});
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ serviceName: options.name, state: options.state});
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