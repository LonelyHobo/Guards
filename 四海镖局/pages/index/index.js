//index.js
//获取应用实例
const app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var citys = require('../../utils/city.js');
var provinces = require('../../utils/province.js');

//接口
var prot = require('../../utils/prot.js');

var qqmapsdk;
Page({
  data: {
    api:prot.api,
    motto: 'Hello World',
    userInfo: {},
    ovHidden:false,
    userTopUrl:'/images/icon_top.png',
    userName:'登陆/注册',
    route:"home",
    userPhone: '17512840813',
    headertitle:"四海镖局",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    footerlist:[
      { name: '首页', code: 'home', icon: 'icon-xiazai45'},
      { name: '服务商列表', code: 'service', icon:'icon-liebiao' },
      { name: '预约服务', code: 'reserve', icon: 'icon-yuyuen' },
      { name: '一键求助', code: 'seekHelp', icon: 'icon-dian' },
      { name: '我的订单', code: 'orderform', icon: 'icon-wode' },
    ],
    bannerData:[

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
    serviceNavMinData:[
      { title: '国内', code: '1', on: 'on' },
      { title: '海外', code: '2', on: '' }
    ],
    serviceNavData:[
      { title: '服务地区', code: '1', icon: 'icon-xia1',on:'' },
      { title: '特色服务', code: '2', icon: 'icon-xia1', on: '' }
    ],
    reserveListData:[
      { title: '私人保镖服务', serviceName: '香港卫安', serviceArea: '中国香港',code:'1', url: '/images/icon_list_1.png', describe:'全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何'},
      { title: '家庭保镖服务', serviceName: '北京万家', serviceArea: '北京', code: '2', url: '/images/icon_list_1.png', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何' },
      { title: '物资押运', serviceName: '香港卫安', serviceArea: '中国香港', code: '3', url: '/images/icon_list_1.png', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何' }
    ],
    orderNavData:[
      {
        title: '全部', code: '1', on: 'on', datalist: [{
          title: '特种保镖', code: '1_1', url: '/images/orderform_list.jpg', order: '8888888', state: '服务中', describe: '处理一般突发安全威胁或安全伤害事件，进行人身安全保护', money: '面谈商议'
        },
          {
            title: '私人保镖', code: '1_2', url: '/images/orderform_list.jpg', order: '8888888', state: '服务中', describe: '处理一般突发安全威胁或安全伤害事件，进行人身安全保护', money: '面谈商议'
          },] },
      {
        title: '派单中', code: '2', on: '', datalist: [{
          title: '特种保镖', code: '1_1', url: '/images/orderform_list.jpg', order: '8888888', state: '派单中', describe: '处理一般突发安全威胁或安全伤害事件，进行人身安全保护', money: '面谈商议'
        },
        {
          title: '私人保镖', code: '1_2', url: '/images/orderform_list.jpg', order: '8888888', state: '派单中', describe: '处理一般突发安全威胁或安全伤害事件，进行人身安全保护', money: '面谈商议'
        },] },
      {
        title: '服务中', code: '3', on: '', datalist: [{
          title: '特种保镖', code: '1_1', url: '/images/orderform_list.jpg', order: '8888888', state: '服务中', describe: '处理一般突发安全威胁或安全伤害事件，进行人身安全保护', money: '面谈商议'
        },
        {
          title: '私人保镖', code: '1_2', url: '/images/orderform_list.jpg', order: '8888888', state: '服务中', describe: '处理一般突发安全威胁或安全伤害事件，进行人身安全保护', money: '面谈商议'
        },] },
      {
        title: '已完成', code: '4', on: '', datalist: [{
          title: '特种保镖', code: '1_1', url: '/images/orderform_list.jpg', order: '8888888', state: '已完成', describe: '处理一般突发安全威胁或安全伤害事件，进行人身安全保护', money: '面谈商议'
        },
        {
          title: '私人保镖', code: '1_2', url: '/images/orderform_list.jpg', order: '8888888', state: '已完成', describe: '处理一般突发安全威胁或安全伤害事件，进行人身安全保护', money: '面谈商议'
        },] },
    ],
    orderData:[
      {
        title: '特种保镖', code: '1_1', url: '/images/orderform_list.jpg', order: '8888888', state: '服务中', describe: '处理一般突发安全威胁或安全伤害事件，进行人身安全保护', money:'面谈商议'},
      {
        title: '私人保镖', code: '1_2', url: '/images/orderform_list.jpg', order: '8888888', state: '服务中', describe: '处理一般突发安全威胁或安全伤害事件，进行人身安全保护', money: '面谈商议'
      },
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
    featureTop:'top',
    serviceAreaData: [],
    featureData:[
      {title:'物资押运',code:'0',on:''},
      { title: '私人保镖', code: '1', on: '' },
      { title: '警卫派驻', code: '2', on: '' },
      { title: '接送机礼遇', code: '3', on: '' },
    ],
    loadingShow:'0',
    serviceAreaMinData:[],
    serviceAreaCheckedData:[]
  },
  //搜索
  searchTop:function(){
    wx.navigateTo({
      url: '../searchAll/searchAll'
    })
  },
  //个人信息
  personalClick: function () {
    wx.navigateTo({
      url: '../personalDetails/personalDetails'
    })
  },
  //服务商更多
  fwsMore: function (obj){
    this.data.servicelist.forEach(function (value, index) {
      value.ischecked = '0';
      if (value.code == 'service') {
        value.ischecked = '1';
      }
    })
    this.setData({ route: 'service', serviceRoute: 'service', servicelist: this.data.servicelist, ovHidden: true });
    this.setData({ ovHidden: false });
  },
  //服务商点击
  fwsClick:function(obj){
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var title_ = obj.target.dataset.title || obj.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../serviceDetails/serviceDetails?state=1&code=' + code_ + '&name=' + title_
    })
  },
  //首页服务点击
  tsfwClick: function (obj) {
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var title_ = obj.target.dataset.title || obj.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../reserveDetails/reserveDetails?state=1&code=' + code_  + '&title=' + title_
    })
  },
  //更多服务
  tsfwMore:function(obj){
    this.data.servicelist.forEach(function (value, index) {
      value.ischecked = '0';
      if (value.code == 'reserve') {
        value.ischecked = '1';
      }
    })
    this.setData({ route: 'reserve', serviceRoute: 'reserve', servicelist: this.data.servicelist, ovHidden: true });
    this.setData({ ovHidden: false });
  },
  //订单切换
  orderNavClick: function (obj){
    var the = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.orderNavData.forEach(function (value, index) {
      value.on = '';
      if (value.code == code_) {
        the.data.orderNavData[index].on = 'on';
        datalist = the.data.orderNavData[index].datalist
      }
    })
    this.setData({ orderNavData: this.data.orderNavData, orderData: datalist });
  },
  //登陆
  orderLogin: function (obj){
    
  },
  //一键求助
  seekhelpSave: function (obj){

  },
  //服务列表点击
  reserveListDataClick:function(obj){
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var name_ = obj.target.dataset.name || obj.currentTarget.dataset.name;
    var area_ = obj.target.dataset.area || obj.currentTarget.dataset.area;
    var title_ = obj.target.dataset.title || obj.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../reserveDetails/reserveDetails?state=1&code=' + code_ + '&name=' + name_ + '&area=' + area_ + '&title=' + title_
    })
  },
  //服务预约点击
  reserveListDataClick2: function (obj) {
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var name_ = obj.target.dataset.name || obj.currentTarget.dataset.name;
    var area_ = obj.target.dataset.area || obj.currentTarget.dataset.area;
    var title_ = obj.target.dataset.title || obj.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../reserveDetails2/reserveDetails2?code=' + code_ + '&name=' + name_ + '&area=' + area_ + '&title=' + title_
    })
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
  //服务地区是否国内选择
  serviceNavMinClick: function (obj){
    var the = this;
    var serviceAreaDatas = [];
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.serviceNavMinData.forEach(function (value, index) {
      value.on = '';
      if (value.code == code_) {
        value.on = 'on';
        var province_ = [];
        if (code_=='1') {
          province_=provinces.province;
        }else{
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
  serviceAreaMinClick: function (obj){
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
      }else{
        value.on = '';
      }
    });
    this.data.serviceNavData.forEach(function (value, index) {
      value.on = '';
      value.icon = 'icon-xia1';
      if (value.code == '1') {
        value.check = on_ == 'on' ? 'check' : '';
        value.title = on_ == 'on' ? the.data.serviceAreaCheckedData.title:'服务地区';
      }
    });
    this.setData({ serviceAreaMinData: this.data.serviceAreaMinData, serviceAreaCheckedData: the.data.serviceAreaCheckedData, serviceNavTop: 'top', serviceNavData: this.data.serviceNavData});
  },
  //服务地区省选择
  serviceAreaClick: function (obj){
    var the = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.serviceAreaData.forEach(function (value, index) {
      value.on = '';
      if (value.code == code_) {
        the.data.serviceAreaData[index].on ='on';
        datalist=the.data.serviceAreaData[index].datalist;
      }
    })
    this.setData({ serviceAreaData: this.data.serviceAreaData, serviceAreaMinData: datalist });
  },
  //特色服务选择
  featureClick: function (obj){
    var the = this;
    var on_ = '',title_='';
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.data.featureData.forEach(function (value, index) {
      if (value.code == code_) {
        value.on = value.on == 'on' ? '' :'on';
        on_ = value.on;
        title_= value.title;
      }else{
        value.on = '';
      }
    })
    this.data.serviceNavData.forEach(function (value, index) {
      value.on = '';
      value.icon = 'icon-xia1';
      if (value.code=='2'){
        value.check = on_ == 'on' ? 'check' :''
        value.title = on_ == 'on' ? title_ : '特色服务';
      }
    });
    this.setData({ featureData: this.data.featureData, featureTop: 'top', serviceNavData: this.data.serviceNavData});
  },
  //服务地区 特色服务
  serviceNavClick: function (obj){
    var the = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.data.serviceNavData.forEach(function (value, index) {
      if (value.code == code_) {
        the.data.serviceNavData[index].on = the.data.serviceNavData[index].on=='on'?'':'on';
        the.data.serviceNavData[index].icon = the.data.serviceNavData[index].icon=='icon-xia1'?'icon-shang':'icon-xia1';
        if (code_ == '1') {
          the.data.featureTop = 'top';
          the.data.serviceNavTop = the.data.serviceNavData[index].on == 'on' ? 'bottom' : 'top';
        } else {
          the.data.serviceNavTop = 'top';
          the.data.featureTop = the.data.serviceNavData[index].on == 'on' ? 'bottom' : 'top';
        }
      }else{
        value.on = '';
        value.icon = 'icon-xia1';
      }
    });
    if (code_ == '1'){
      this.setData({ serviceNavData: this.data.serviceNavData, serviceNavTop: the.data.serviceNavTop, featureTop: the.data.featureTop });
    }else{
      this.setData({ serviceNavData: this.data.serviceNavData, serviceNavTop: the.data.serviceNavTop, featureTop: the.data.featureTop });
    }
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
    this.setData({ servicelist: this.data.servicelist, serviceRoute: (code_ == 'service' || code_ == 'reserve') ? code_ : 'service'});
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
    this.setData({ servicelist: this.data.servicelist, serviceRoute: code_, route: code_ });
  },
  //服务商点击
  serviceListClick: function (obj){
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var name_ = obj.target.dataset.name || obj.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../serviceDetails/serviceDetails?state=1&code=' + code_ + '&name=' + name_
    })
  },
  onShow: function () {
    let vm = this;
    try{
      var data = wx.getStorageSync("locations");
      if (data==''){
        vm.getUserLocation();
      }else{
        wx.getStorage({
          key: 'locations',
          success: function (res) {
            if (!res.data.city) {
              vm.getUserLocation();
            } else {
              vm.setData({
                province: res.data.province,
                city: res.data.city,
                latitude: res.data.latitude,
                longitude: res.data.longitude
              });
            }
          }
        });
      }
    } catch(err){
      vm.getUserLocation();
    }
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
        let province = res.result.ad_info.province;
        let city = res.result.ad_info.city;
        city = city.replace("市", "");
        vm.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        });
        wx.setStorage({
          key: 'locations',
          data: {
            province: province,
            city: city,
            latitude: latitude, 
            longitude: longitude
          }
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  //图片报错处理
  picError: function (obj){
    var picId = obj.target.dataset.picId || obj.currentTarget.dataset.picId;
    this.data.bannerData.forEach(function (value, index) {
      if (value.picId == picId) {
        value.PicUrl = '/images/banner1_1.png';
      }
    });
    this.setData({ bannerData: this.data.bannerData });
  },
  phoneCall: function (obj){
    wx.makePhoneCall({
      phoneNumber: obj.target.dataset.phone || obj.currentTarget.dataset.phone,
      success: function () {
        console.log("成功拨打电话")
      },
    })
  },
  onLoad: function () {
    var vm = this;
    //首页轮播
    wx.request({
      url: prot.GetIndexBannerListPage,
      method: 'GET',
      data:{
        args:{
          start:1,
          limit:10,
          sort:'SortNo',
          dir:'DESC',
          NavCode:'IndexBanner'
        }
      },
      success: function (res) {
        if (res.statusCode==200){
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          data.forEach(function (value, index) {
            value.PicUrl = vm.data.api + value.PicUrl;
          });
          vm.setData({ bannerData: data});
        }
      }
    });
    //首页服务列表
    wx.request({
      url: prot.GetServiceListPage,
      method: 'GET',
      data: {
        args: {
          start: 1,
          limit: 999,
          sort: 'SortNo',
          dir: 'DESC',
          IsRelease :true,
          IsRecommend :true
        }
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          //vm.setData({ tsfwData: data });
        }
      }
    });
    //首页服务商列表
    wx.request({
      url: prot.GetMerchantListPage,
      method: 'GET',
      data: {
        args: {
          start: 1,
          limit: 10,
          sort: 'SortNo',
          dir: 'DESC',
          IsRelease: true,
          IsRecommend: true
        }
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          debugger;
          //vm.setData({ tsfwData: data });
        }
      }
    });
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
    }else{
      app.userInfoReadyCallback=function(res){
        vm.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
  },
  getUserInfo: function(e) {
    if (!e.detail.userInfo)return;
    var vm = this;
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    wx.setStorage({
      key: 'userdata',
      data: e.detail.userInfo
    });
    var state = e.target.dataset.state || e.currentTarget.dataset.state;
    if (state == 'reserve'){
      var code_ = e.target.dataset.code || e.currentTarget.dataset.code;
      var name_ = e.target.dataset.name || e.currentTarget.dataset.name;
      var area_ = e.target.dataset.area || e.currentTarget.dataset.area;
      var title_ = e.target.dataset.title || e.currentTarget.dataset.title;
      wx.navigateTo({
        url: '../reserveDetails2/reserveDetails2?code=' + code_ + '&name=' + name_ + '&area=' + area_ + '&title=' + title_
      })
    }
  }
})
