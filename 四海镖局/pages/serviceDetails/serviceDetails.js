// pages/appointment/appointment.js
var provinces = require('../../utils/province.js');
var prot = require('../../utils/prot.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxLocation = require('../../utils/wxLocation.js');
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: prot.api,
    merchantName: "",
    serviceArea: "",
    merchantId: '',
    serviceTitle: "",
    serviceId: '',
    userKey:'',
    hasUserInfo: false,
    bannerData: [],
    streamerData: [],
    serviceData: [],
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    state: 1,
    serviceNavTop: 'top',
    serviceAreaMinData: [],
    serviceAreaCheckedData: {},
    serviceCode: '',
    serviceNavMinData: [],
    serviceAreaData: [],
    introduceNavData: [],
    introduceListData: [],
    collectState: false,
    likeState: false,
  },
  //搜索
  searchTop: function () {
    wx.navigateTo({
      url: '../searchAll/searchAll'
    })
  },
  //收藏 点赞
  collectClick: function(e) {
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
        SourceCode: 'MerChant',
        SourceID: vm.data.merchantId
      }),
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var data = typeof(res.data) === 'string' ? JSON.parse(res.data) : res.data;
          var is = vm.data[btn == 'collect' ? 'collectState' : 'likeState'];
          is = !is;
          if (btn == 'collect'){
            vm.setData({
              collectState: is
            })
          }else{
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
  getUserInfo: function(e) {
    if (!e.detail.userInfo) return;
    var vm = this;
    var userInfo_ = e.detail.userInfo;
    app.loginRequest(userInfo_,function(){
      //登录成功回调
      wx.showToast({
        title: '登录成功！',
        mask: true,
        icon: 'success',
        duration: 1000,
        success: function () {
          var serviceId = e.target.dataset.code || e.currentTarget.dataset.code;
          if (serviceId) {
            var merchantName = this.data.merchantName; //服务商名称
            var merchantId = this.data.merchantId; //服务商id
            var areaCode = this.data.serviceAreaCheckedData[serviceId].regionID;
            var areaName = this.data.serviceAreaCheckedData[serviceId].title;
            var serviceName = e.target.dataset.title || e.currentTarget.dataset.title;
            wx.navigateTo({
              url: '../appointment/appointment?serviceId=' + serviceId + '&merchantName=' + merchantName + '&merchantId=' + merchantId + '&areaCode=' + areaCode + '&areaName=' + areaName + '&serviceName=' + serviceName
            })
          } else {
            vm.collectClick(e);
          }
        }
      });
    });
  },
  //预约服务点击
  introduceListClick: function(obj) {
    var serviceId = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var merchantName = this.data.merchantName; //服务商名称
    var merchantId = this.data.merchantId; //服务商id
    var areaCode = this.data.serviceAreaCheckedData[serviceId].regionID;
    var areaName = this.data.serviceAreaCheckedData[serviceId].title;
    var is_ = false;
    var serviceName = obj.target.dataset.title || obj.currentTarget.dataset.title;
    this.data.introduceListData.forEach(function(value) {
      if (value.ServiceID == serviceId && !value.city) {
        is_ = true;
      }
    });
    if (is_) {
      wx.showToast({
        title: '请先选择服务地区',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.navigateTo({
      url: '../appointment/appointment?serviceId=' + serviceId + '&merchantName=' + merchantName + '&merchantId=' + merchantId + '&areaCode=' + areaCode + '&areaName=' + areaName + '&serviceName=' + serviceName
    })
  },
  //无状态点击
  alertClick: function() {
    wx.showToast({
      title: '请先选择服务地区',
      icon: 'none',
      duration: 2000
    })
    return;
  },
  //直接预约点击
  appointmentBtn: function(obj) {
    var serviceId = this.data.serviceName;
    var merchantName = this.data.merchantName; //服务商名称
    var merchantId = this.data.merchantId; //服务商id
    var areaCode = this.data.areaCode;
    var areaName = this.data.areaName;
    var serviceName = this.data.serviceName;
    wx.navigateTo({
      url: '../appointment/appointment?serviceId=' + serviceId + '&merchantName=' + merchantName + '&merchantId=' + merchantId + '&areaCode=' + areaCode + '&areaName=' + areaName + '&serviceName=' + serviceName
    });
  },
  //选择服务地区
  introduceListClick2: function(obj) {
    var vm = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var city_ = obj.target.dataset.city || obj.currentTarget.dataset.city;
    if (city_) {
      this.data.serviceAreaMinData.forEach(function(value, index) {
        if (value.title == city_) {
          value.on = 'on';
        } else {
          value.on = '';
        }
      });
    } else {
      this.data.serviceAreaMinData.forEach(function(value, index) {
        value.on = '';
      });
    };
    var serviceAreaDatas = [];
    if (this.data.introduceNavData[0].on == 'on') {
      var data = [];
      this.data.serviceNavMinData1.forEach(function(value, index) {
        if (index == 0) {
          data.push(value);
        }
      })
      this.data.serviceNavMinData = data;
      serviceAreaDatas = vm.data.serviceAreaData1;
    } else {
      var data = [];
      this.data.serviceNavMinData1.forEach(function(value, index) {
        if (index == 1) {
          data.push(value);
        }
      })
      this.data.serviceNavMinData = data;
      serviceAreaDatas = vm.data.serviceAreaData2;
    }
    this.setData({
      serviceAreaMinData: this.data.serviceAreaMinData,
      serviceNavTop: 'bottom',
      serviceCode: code_,
      serviceNavMinData: this.data.serviceNavMinData,
      serviceAreaData: serviceAreaDatas,
      serviceAreaMinData: serviceAreaDatas[0].datalist
    });
  },
  //服务地区切换
  introduceNavClick: function(obj) {
    var vm = this;
    var regionID = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.data.introduceNavData.forEach(function(value, index) {
      value.on = '';
      if (value.regionID == regionID) {
        wx.showLoading({
          title: '加载中...',
        })
        value.on = 'on';
        wx.request({
          url: prot.GetServiceListPageByMerchant,
          method: 'GET',
          data: {
            args: {
              start: 0,
              limit: 10,
              sort: 'SortNo',
              dir: 'DESC',
              RegionID: index == 0 ? 0 : 1519,
              MerchantID: vm.data.merchantId,
            }
          },
          success: function(res) {
            wx.hideLoading();
            if (res.statusCode == 200) {
              var data = typeof(res.data) === 'string' ? JSON.parse(res.data) : res.data;
              data.forEach(function(value, index) {
                value.PicUrl = vm.data.api + value.PicUrl;
                var introduce = value.Introduce;
                var nodes = WxParse.wxParse('introduce' + index, 'html', introduce, vm, 5);
                data[index]['nodes'] = nodes;
              });
              vm.setData({
                introduceListData: data,
              });
            }
          }
        });
      }
    })
    this.setData({
      introduceNavData: this.data.introduceNavData
    });
  },
  //服务地区是否国内选择
  serviceNavMinClick: function(obj) {
    var vm = this;
    var serviceAreaDatas = [];
    var regionID = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.serviceNavMinData.forEach(function(value, index) {
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
  serviceAreaMinClick: function(obj) {
    var vm = this;
    var title_ = '';
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
    this.data.serviceAreaMinData.forEach(function(value, index) {
      if (value.regionID == code_) {
        value.on = 'on';
        vm.data.serviceAreaCheckedData[vm.data.serviceCode] = value;
        title_ = value.title;
      } else {
        value.on = '';
      }
    });
    this.data.introduceListData.forEach(function(value) {
      if (value.ServiceID == vm.data.serviceCode) {
        value.city = title_;
      }
    });
    this.setData({
      serviceAreaMinData: this.data.serviceAreaMinData,
      serviceAreaCheckedData: vm.data.serviceAreaCheckedData,
      serviceNavTop: 'top',
      introduceListData: this.data.introduceListData,
      serviceAreaData1: vm.data.serviceAreaData1, 
      serviceAreaData2: vm.data.serviceAreaData2
    });
  },
  //服务地区省选择
  serviceAreaClick: function(obj) {
    var vm = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.serviceAreaData.forEach(function(value, index) {
      value.on = '';
      if (value.regionID == code_) {
        vm.data.serviceAreaData[index].on = 'on';
        datalist = vm.data.serviceAreaData[index].datalist;
      }
    })
    this.setData({
      serviceAreaData: this.data.serviceAreaData,
      serviceAreaMinData: datalist
    });
  },
  backShow: function (key){
    var vm = this;
    if (key){
      vm.backShowBefore(key);
    }else{
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
  backShowBefore:function(key){
    var vm = this;
    //是否点赞收藏过
    wx.request({
      url: prot.GetIsCollect,
      method: 'GET',
      data: {
        args: {
          SourceCode: 'MerChant',
          SourceID: vm.data.merchantId
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
    wx.request({
      url: prot.GetIsLike,
      method: 'GET',
      data: {
        args: {
          SourceCode: 'Merchant',
          SourceID: vm.data.merchantId
        },
        WeSessionKey: key
      },
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          vm.setData({
            likeState: data.result,
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var vm = this;
    this.setData({
      merchantName: options.merchantName || '',
      state: options.state || '',
      merchantId: options.merchantId || '',
      serviceId: options.serviceId || '',
      serviceName: options.serviceName || '',
      areaCode: options.areaCode || '',
      areaName: options.areaName || '',
    });
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
              hasUserInfo: true
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
    wx.showLoading({
      title: '加载中...',
    });
    //详情
    wx.request({
      url: prot.GetMerchantDetail,
      method: 'GET',
      data: {
        id: options.merchantId,
      },
      success: function(res) {
        if (res.statusCode == 200) {
          var data = typeof(res.data) === 'string' ? JSON.parse(res.data) : res.data;
          data.Plist = data.Plist ? data.Plist : [{
            PicId: '',
            PicUrl: '/images/banner1_1.png'
          }];
          vm.setData({
            serviceData: data
          });
          var introduce = data.Introduce;
          WxParse.wxParse('introduce', 'html', introduce, vm, 5);
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
      success: function(res) {
        if (res.statusCode == 200) {
          var data = typeof(res.data) === 'string' ? JSON.parse(res.data) : res.data;
          data.forEach(function(value, index) {
            value.PicUrl = vm.data.api + value.PicUrl;
          });
          vm.setData({
            streamerData: data
          });
        }
      }
    });
    //服务列表
    wx.request({
      url: prot.GetServiceListPageByMerchant,
      method: 'GET',
      data: {
        args: {
          start: 0,
          limit: 10,
          sort: 'SortNo',
          dir: 'DESC',
          RegionID: 0,
          MerchantID: options.merchantId,
        }
      },
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var data = typeof(res.data) === 'string' ? JSON.parse(res.data) : res.data;
          data.forEach(function(value, index) {
            if (value.PicUrl && value.PicUrl != null) {
              value.PicUrl = vm.data.api + value.PicUrl;
            } else {
              value.PicUrl = '/images/imgNull.png';
            }
            var introduce = value.Introduce;
            var nodes = WxParse.wxParse('introduce' + index, 'html', introduce, vm, 5);
            data[index]['nodes'] = nodes;
          });
          vm.setData({
            introduceListData: data,
          });
        }
      }
    });
    //服务地区
    wx.request({
      url: prot.GetRegionListAll,
      method: 'GET',
      success: function(res) {
        if (res.statusCode == 200) {
          var data = typeof(res.data) === 'string' ? JSON.parse(res.data) : res.data;
          var city0 = [],
            city1 = [],
            city2 = {},
            city3 = [];
          data.forEach(function(value, index) {
            var index_ = index;
            if (value.ParentID == 0) {
              //国家
              city0.push({
                title: value.Name,
                regionID: value.RegionID,
                code: value.Code,
                on: (value.RegionID == 1 ? 'on' : ''),
                parentId: value.ParentID,
                datalist: []
              });
            } else if (value.ParentID == 1) {
              //省
              city1.push({
                title: value.Name,
                regionID: value.RegionID,
                code: value.Code,
                on: (value.RegionID == 2 ? 'on' : ''),
                parentId: value.ParentID,
                datalist: []
              });
            } else if (value.ParentID == 1519) {
              //国外
              city3.push({
                title: value.Name,
                regionID: value.RegionID,
                code: value.Code,
                on: (value.RegionID == 534 ? 'on' : ''),
                parentId: value.ParentID,
                datalist: []
              });
            } else {
              //市
              if (city2[value.ParentID]) {
                city2[value.ParentID].push({
                  title: value.Name,
                  regionID: value.RegionID,
                  code: value.Code,
                  on: '',
                  parentId: value.ParentID
                });
              } else {
                city2[value.ParentID] = [{
                  title: value.Name,
                  regionID: value.RegionID,
                  code: value.Code,
                  on: '',
                  parentId: value.ParentID
                }];
              }
            }
          });
          city1.forEach(function(value) {
            value.datalist = city2[value.regionID];
          });
          city3.forEach(function(value) {
            if (city2[value.regionID]) {
              value.datalist = city2[value.regionID];
            } else {
              value.datalist.push({
                title: value.title,
                regionID: value.regionID,
                code: value.code,
                on: '',
                parentId: value.parentId
              });
            }
          });
          vm.setData({
            serviceNavMinData: city0,
            serviceNavMinData1: city0,
            introduceNavData: city0,
            serviceAreaData: city1,
            serviceAreaData1: city1,
            serviceAreaMinData: city1[0].datalist,
            serviceAreaData2: city3,
            serviceAreaMinData2: city3[0].datalist,
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})