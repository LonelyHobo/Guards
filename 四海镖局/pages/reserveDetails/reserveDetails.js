// pages/appointment/appointment.js
var provinces = require('../../utils/province.js');
var prot = require('../../utils/prot.js');
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
var wxLocation = require('../../utils/wxLocation.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api:prot.api,
    serviceName: "",
    serviceArea: "",
    serviceTitle: "",
    serviceId:'',
    streamerData:[],
    areaCode:1,
    userInfo:{},
    hasUserInfo:false,
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
    featureData: [],
    serviceAreaData: [],
    serviceAreaMinData: [],
    collectState:false,
  },
  //搜索
  searchTop: function () {
    wx.navigateTo({
      url: '../searchAll/searchAll'
    })
  },
  //收藏 点赞
  collectClick: function (e) {
    var vm = this;
    //点赞  收藏
    wx.showLoading({
      title: '加载中...',
    })
    var btn = e.target.dataset.btn || e.currentTarget.dataset.btn;
    wx.request({
      url: (btn == 'collect' ? vm.data.collectState ? prot.CollectDel : prot.CollectSave : vm.data.likeState ? prot.LikeDel : prot.LikeSave) + '?WeSessionKey=' + vm.data.userKey,
      method: 'POST',
      data: JSON.stringify({
        SourceCode: 'Service',
        SourceID: vm.data.serviceId
      }),
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          var is = vm.data[btn == 'collect' ? 'collectState' : 'likeState'];
          is = !is;
          if (btn == 'collect') {
            vm.setData({
              collectState: is
            })
          } else {
            vm.setData({
              likeState: is
            })
          }
          wx.showToast({
            title: btn == 'collect' ? is ? '已收藏' : '已取消收藏' : is ? '已点赞' : '已取消点赞',
            icon: 'success',
            duration: 1000
          })
        }
      }
    });
  },
  //登录
  getUserInfo: function (e) {
    if (!e.detail.userInfo) return;
    var vm = this;
    var userInfo_ = e.detail.userInfo;
    app.loginRequest(userInfo_, function () {
      //登录成功回调
      wx.showToast({
        title: '登录成功！',
        mask: true,
        icon: 'success',
        duration: 1000,
        success: function () {
          vm.collectClick(e);
        }
      });
    });
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
    vm.data.serviceAreaData1.forEach(function (value, index) {
      value.datalist.forEach(function (value) {
        if (value.regionID != code_) {
          value.on = '';
        }
      })
    });
    vm.data.serviceAreaData2.forEach(function (value, index) {
      value.datalist.forEach(function (value) {
        if (value.regionID != code_) {
          value.on = '';
        }
      })
    });
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
    this.setData({ serviceAreaMinData: this.data.serviceAreaMinData, serviceAreaCheckedData: vm.data.serviceAreaCheckedData, serviceNavTop: 'top', serviceNavData: this.data.serviceNavData, serviceAreaData1: vm.data.serviceAreaData1, serviceAreaData2: vm.data.serviceAreaData2 });
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
      url: '../serviceDetails/serviceDetails?state=1&merchantId=' + code_ + '&merchantName=' + title_
    })
  },
  yuyue:function(){
    wx.navigateTo({
      url: '../reserveDetails2/reserveDetails2?title=' + this.data.serviceTitle + '&areaCode=' + this.data.areaCode + '&code=' + this.data.serviceId
    })
  },
  backShow: function (key) {
    var vm = this;
    if (key) {
      vm.backShowBefore(key);
    } else {
      wx.getStorage({
        key: 'userKey',
        success: function (res) {
          vm.setData({
            userKey: res.data.key
          });
          vm.backShowBefore(res.data.key);
        }
      });
    }
  },
  backShowBefore: function (key) {
    var vm = this;
    //是否点赞收藏过
    wx.request({
      url: prot.GetIsCollect,
      method: 'GET',
      data: {
        args: {
          SourceCode: 'Service',
          SourceID: vm.data.serviceId
        },
        WeSessionKey: key
      },
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          vm.setData({
            collectState: data.result,
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm = this;
    this.setData({ serviceTitle: options.title, state: options.state, serviceId: options.code, areaCode: options.areaCode });
    try {
      var data = wx.getStorageSync("userdata");
      if (!data || data == '') {
        app.userInfoReadyCallback = function (res, key) {
          vm.setData({
            userInfo: res,
            hasUserInfo: true,
            userKey: key
          });
          vm.backShow(key);
        };
      } else {
        wx.getStorage({
          key: 'userdata',
          success: function (res) {
            vm.setData({
              userInfo: res.data,
              hasUserInfo: true,
            });
          }
        });
        wx.getStorage({
          key: 'userKey',
          success: function (res) {
            vm.setData({
              userKey: res.data.key
            });
            vm.backShow(res.data.key);
          }
        });
      }
    } catch (err) {
      app.userInfoReadyCallback = function (res, key) {
        vm.setData({
          userInfo: res,
          hasUserInfo: true,
          userKey: key
        });
        vm.backShow(key);
      };
    }
    //详情
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
    if (options.areaCode!=0){
      var data = {
        args: {
          start: 0,
          limit: 10,
          sort: 'A.SortNo',
          dir: 'DESC',
          SpecialID: options.code
        }
      };
    }else{
      var data = {
        args: {
          start: 0,
          limit: 10,
          sort: 'A.SortNo',
          dir: 'DESC',
          SpecialID: options.code
        }
      };
    }
    wx.request({
      url: prot.GetMerchantListPageByService,
      method: 'GET',
      data: data,
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
})