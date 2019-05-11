//index.js
//获取应用实例
const app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var citys = require('../../utils/city.js');
var provinces = require('../../utils/province.js');
var qqmapsdk;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    route:"service",
    headertitle:"四海镖局",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    footerlist:[
      { name: '首页', code: 'home', icon: 'icon-xiazai45'},
      { name: '服务商列表', code: 'service', icon:'icon-liebiao' },
      { name: '预约服务', code: 'seek', icon: 'icon-yuyuen' },
      { name: '一键求助', code: 'seekHelp', icon: 'icon-dian' },
      { name: '我的订单', code: 'orderform', icon: 'icon-wode' },
    ],
    tsfwData:[
      { title: '物资押运', url: '/images/icon_index_1.png', code:'001'},
      { title: '私人保镖', url: '/images/icon_index_2.png', code: '002' },
      { title: '警卫派驻', url: '/images/icon_index_3.png', code: '003' },
      { title: '接送机礼遇', url: '/images/icon_index_4.png', code: '004' },
      { title: '物资押运', url: '/images/icon_index_1.png', code: '001' },
      { title: '私人保镖', url: '/images/icon_index_2.png', code: '002' },
      { title: '警卫派驻', url: '/images/icon_index_3.png', code: '003' },
      { title: '接送机礼遇', url: '/images/icon_index_4.png', code: '004' },
    ],
    fwsData: [
      { title: '北京万家', url: '/images/icon_index_list_1.png', code: '001' },
      { title: '香港卫安', url: '/images/icon_index_list_2.png', code: '002' },
    ],
    servicelist:[
      { name: '服务商', ischecked: '1', code:'service'},
      { name: '服务', ischecked: '0', code: 'reserve' }
    ],
    serviceRoute:'service',
    serviceData:[
      { title: '香港卫安', url: '/images/icon_list_2.jpg', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何', label: '特色标签：私人保镖', code:'001'},
      { title: '北京万家', url: '/images/icon_list_3.jpg', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何', label: '特色标签：私人保镖', code: '002' },
      { title: '上海永安', url: '/images/icon_list_2.jpg', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何', label: '特色标签：私人保镖', code: '003' }
    ],
    reserveNavData:[
      { title: '国内服务', code: '1', on: 'on' },
      { title: '海外服务', code: '2', on: '' }
    ],
    serviceNavData:[
      { title: '服务地区', code: '1', icon: 'icon-xia1',on:'' },
      { title: '特色服务', code: '2', icon: 'icon-xia1', on: '' }
    ],
    reserveListData:[
      { title: '私人保镖服务', url: '/images/icon_list_1.png', describe:'全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何'},
      { title: '家庭保镖服务', url: '/images/icon_list_1.png', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何' },
      { title: '物资押运', url: '/images/icon_list_1.png', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何' }
    ],
    reserveListHead:'国内服务列表',
    province: '',
    city: '...',
    latitude: '',
    longitude: '',
    service:{
      nav:'-1'
    },
    serviceNavTop:'top',
    serviceAreaData: [],
    loadingShow:'0',
    serviceAreaMinData:[],
    serviceAreaCheckedData:[]
  },
  //服务列表点击
  reserveListDataClick:function(obj){

  },
  //服务分类选择
  reserveNavDataClick: function (obj){
    var the = this;
    var reserveListHead='';
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.reserveNavData.forEach(function (value, index) {
      value.on = '';
      if (value.code == code_) {
        the.data.reserveNavData[index].on = 'on';
        reserveListHead = the.data.reserveNavData[index].title+'列表';
      }
    })
    this.setData({ reserveNavData: this.data.reserveNavData, reserveListHead: reserveListHead });
  },
  //服务地区选择
  serviceAreaMinClick: function (obj){
    var the = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.data.serviceAreaMinData.forEach(function (value, index) {
      value.on = '';
      if (value.code == code_) {
        the.data.serviceAreaMinData[index].on = the.data.serviceAreaMinData[index].on == 'on' ? '' : 'on';
        var on_ = the.data.serviceAreaMinData[index].on;
        var codes = the.data.serviceAreaMinData[index].code;
        var judge = true;
        the.data.serviceAreaCheckedData = the.data.serviceAreaMinData[index];
      }
    });
    this.setData({ serviceAreaMinData: this.data.serviceAreaMinData, serviceAreaCheckedData: the.data.serviceAreaCheckedData});
  },
  //服务地区省选择
  serviceAreaClick: function (obj){
    var the = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.serviceAreaData.forEach(function (value, index) {
      value.on = '';
      if (value.code == code_) {
        the.data.serviceAreaData[index].on = 'on';
        datalist=the.data.serviceAreaData[index].datalist;
      }
    })
    this.setData({ serviceAreaData: this.data.serviceAreaData, serviceAreaMinData: datalist });
  },
  tsfwClick: function (obj){
    console.log(obj);
  },
  //服务地区 特色服务
  serviceNavClick: function (obj){
    var the = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.data.serviceNavData.forEach(function (value, index) {
      if (value.code == code_) {
        the.data.serviceNavData[index].on = the.data.serviceNavData[index].on=='on'?'':'on';
        the.data.serviceNavData[index].icon = the.data.serviceNavData[index].icon=='icon-xia1'?'icon-shang':'icon-xia1';
        the.data.serviceNavTop = the.data.serviceNavData[index].on == 'on' ? 'bottom' : 'top';
      }else{
        value.on = '';
        value.icon = 'icon-xia1';
      }
    });
    this.setData({ serviceNavData: this.data.serviceNavData, serviceNavTop: the.data.serviceNavTop});
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (obj) {
    var the = this;
    if (this.data.route == 'service'){
      this.setData({ loadingShow:'1' });
      setTimeout(function(){
        the.setData({ loadingShow: '0' });
      },2000)
    }
  },
  btnclick: function (obj){
    var the = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.setData({ route: code_ });
    this.data.servicelist.forEach(function (value, index) {
      value.ischecked = '0';
      if (value.code == code_) {
        the.data.servicelist[index].ischecked = '1';
      }
    })
    this.setData({ servicelist: this.data.servicelist, serviceRoute: (code_ == 'service' || code_ == 'reserve') ? code_ :'service'});
  },
  //服务商 and 服务切换
  serviceclick:function(obj){
    var the = this;
    var code_ = obj.target.id || obj.currentTarget.id;
    this.data.servicelist.forEach(function(value,index){
      value.ischecked = '0';
      if (value.code == code_){
        the.data.servicelist[index].ischecked = '1';
      }
    });
    this.setData({ servicelist: this.data.servicelist, serviceRoute: code_});
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    let vm = this;
    vm.getUserLocation();
  },
  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        }
        else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function () {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        // console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        vm.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  onLoad: function () {
    var serviceAreaDatas=[];
    provinces.province.forEach(function(value,index){
      var datalist = [];
      var index_ = index;
      value.citys.forEach(function(value,index){
        datalist.push({ title: value.citysName, code: index_+'_'+index,on:''});
      })
      serviceAreaDatas.push({ title: value.provinceName, code: index, on: (index == 0 ? 'on' : ''), datalist: datalist});
    })
    this.setData({ serviceAreaData: serviceAreaDatas, serviceAreaMinData: serviceAreaDatas[0].datalist });
    qqmapsdk = new QQMapWX({
      key: 'POWBZ-6G5K3-TOV32-3SMJ3-V2HLO-ENBXC'
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
