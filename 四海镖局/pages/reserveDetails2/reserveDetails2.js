// pages/appointment/appointment.js
const app = getApp();
// 引入SDK核心类
var WxParse = require('../../wxParse/wxParse.js');
//接口
var prot = require('../../utils/prot.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api:prot.api,
    serviceName: "",
    serviceArea: "",
    serviceTitle: "",
    serviceData: [],
    streamerData:[],
    areaCode:1,//服务地区 1国内 2海外
    reserveNavData: [
      { title: '国内服务', code: '1', on: 'on' },
      { title: '海外服务', code: '2', on: '' }
    ],
    serviceNavMinData: [],
    serviceNavData: [
      { title: '服务地区', code: '1', icon: 'icon-xia1', on: '' },
      { title: '特色服务', code: '2', icon: 'icon-xia1', on: '' }
    ],
    featureData: [],
    serviceAreaData: [],
    serviceAreaMinData: [],
    serviceNavMinData1:[],
    serviceAreaCheckedData:{},
  },
  //搜索
  searchTop: function () {
    wx.navigateTo({
      url: '../searchAll/searchAll'
    })
  },
  //服务商点击
  serviceListClick: function (obj) {
    if (!this.data.serviceAreaCheckedData.regionID) {
      wx.showToast({
        title: '请先选择服务地区',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var title_ = obj.target.dataset.name || obj.currentTarget.dataset.name;
    var serviceId = this.data.serviceId;
    var serviceName = this.data.serviceTitle;
    var areaCode = this.data.serviceAreaCheckedData.regionID
    var areaName = this.data.serviceAreaCheckedData.title
    wx.navigateTo({
      url: '../serviceDetails/serviceDetails?state=2&merchantId=' + code_ + '&merchantName=' + title_ + '&serviceId=' + serviceId + '&serviceName=' + serviceName + '&areaCode=' + areaCode + '&areaName=' + areaName
    })
  },
  //服务商预约点击
  serviceListClick2: function (obj) {
    if (!this.data.serviceAreaCheckedData.regionID){
      wx.showToast({
        title: '请先选择服务地区',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var title_ = obj.target.dataset.name || obj.currentTarget.dataset.name;
    var serviceId = this.data.serviceId;
    var serviceName = this.data.serviceTitle;
    var areaCode = this.data.serviceAreaCheckedData.regionID
    var areaName = this.data.serviceAreaCheckedData.title
    wx.navigateTo({
      url: '../appointment/appointment?merchantId=' + code_ + '&merchantName=' + title_ + '&serviceId=' + serviceId + '&serviceName=' + serviceName + '&areaCode=' + areaCode + '&areaName=' + areaName
    })
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
    var obj_ = {};
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    vm.data.serviceAreaData1.forEach(function (value, index) {
      value.datalist.forEach(function (value) {
        if (value.regionID != code_){
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
      if (value.regionID == code_) {
        value.on = value.on == 'on' ? '' : 'on';
        on_ = value.on;
        var codes = value.regionID;
        var judge = true;
        vm.data.serviceAreaCheckedData = value;
        obj_=value;
      } else {
        value.on = '';
      }
    });
    this.data.serviceNavData.forEach(function (value, index) {
      value.on = '';
      var areacode_ = vm.data.areaCode == 1 ? 0 : vm.data.areaCode == 2 ? 1519:'';
      value.icon = 'icon-xia1';
      if (value.code == '1') {
        value.check = on_ == 'on' ? 'check' : '';
        value.title = on_ == 'on' ? obj_.title : '服务地区';
        value.regionID = on_ == 'on' ? obj_.regionID : areacode_;
        wx.showLoading({
          title: '加载中...',
        })
        var args = {
          start: 0,
          limit: 10,
          sort: 'SortNo',
          dir: 'DESC',
          SpecialID: vm.data.serviceId
        }
        if (areacode_!=''){
          args.RegionID = areacode_;
        }
        if (value.regionID && value.regionID != '') {
          args.RegionID = obj_.regionID;
        }
        if (vm.data.serviceNavData[1].ServiceID && vm.data.serviceNavData[1].ServiceID != '') {
          args.ServiceID = vm.data.serviceNavData[1].ServiceID;
        }
        wx.request({
          url: prot.GetMerchantListPageByService,
          method: 'GET',
          data: {
            args: args
          },
          success: function (res) {
            wx.hideLoading();
            if (res.statusCode == 200) {
              var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
              data.forEach(function (value, index) {
                value.PicUrl = vm.data.api + value.PicUrl;
                var merchantId = value.MerchantID;
                var introduce = value.Introduce;
                var nodes = WxParse.wxParse('introduce' + index, 'html', introduce, vm, 5);
                data[index]['nodes'] = nodes;
              });
              vm.setData({ serviceData: data });
            }
          }
        });
      }
    });
    this.setData({
      serviceAreaMinData: this.data.serviceAreaMinData,
      serviceAreaData1:vm.data.serviceAreaData1,
      serviceAreaData2:vm.data.serviceAreaData2,
      serviceAreaCheckedData: vm.data.serviceAreaCheckedData,
      serviceNavTop: 'top',
      serviceNavData: this.data.serviceNavData
    });
  },
  //服务地区省选择
  serviceAreaClick: function (obj) {
    var vm = this;
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var datalist = [];
    this.data.serviceAreaData.forEach(function (value, index) {
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
  //特色服务选择
  featureClick: function (obj) {
    var vm = this;
    var on_ = '',
      data_ = '';
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    this.data.featureData.forEach(function (value, index) {
      if (value.CategoryID == code_) {
        value.on = value.on == 'on' ? '' : 'on';
        on_ = value.on;
        data_ = value;
      } else {
        value.on = '';
      }
    })
    this.data.serviceNavData.forEach(function (value, index) {
      value.on = '';
      value.icon = 'icon-xia1';
      if (value.code == '2') {
        value.check = on_ == 'on' ? 'check' : ''
        value.title = on_ == 'on' ? data_.Name : '特色服务';
        value.ServiceID = on_ == 'on' ? data_.CategoryID : '';
        wx.showLoading({
          title: '加载中...',
        })
        var areacode_ = vm.data.areaCode == 1 ? 0 : vm.data.areaCode == 2 ? 1519 : '';
        var args = {
          start: 0,
          limit: 10,
          sort: 'SortNo',
          dir: 'DESC',
          SpecialID: vm.data.serviceId,
        }
        if (areacode_ != '') {
          args.RegionID = areacode_;
        }
        if (value.ServiceID && value.ServiceID != '') {
          args.ServiceID = data_.CategoryID;
        }
        if (vm.data.serviceNavData[0].regionID && vm.data.serviceNavData[0].regionID != '') {
          args.RegionID = vm.data.serviceNavData[0].regionID;
        }
        wx.request({
          url: prot.GetMerchantListPageByService,
          method: 'GET',
          data: {
            args: args
          },
          success: function (res) {
            wx.hideLoading();
            if (res.statusCode == 200) {
              var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
              data.forEach(function (value, index) {
                value.PicUrl = vm.data.api + value.PicUrl;
                var merchantId = value.MerchantID;
                var introduce = value.Introduce;
                var nodes = WxParse.wxParse('introduce' + index, 'html', introduce, vm, 5);
                data[index]['nodes'] = nodes;
              });
              vm.setData({ serviceData: data });
            }
          }
        });
      }
    });
    this.setData({
      featureData: this.data.featureData,
      featureTop: 'top',
      serviceNavData: this.data.serviceNavData
    });
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
      this.setData({
        serviceNavData: this.data.serviceNavData,
        serviceNavTop: vm.data.serviceNavTop,
        featureTop: vm.data.featureTop
      });
    } else {
      this.setData({
        serviceNavData: this.data.serviceNavData,
        serviceNavTop: vm.data.serviceNavTop,
        featureTop: vm.data.featureTop
      });
    }
  },
  //服务商 and 服务切换
  serviceclick: function (obj) {
    var vm = this;
    var code_ = obj.target.id || obj.currentTarget.id;
    this.data.servicelist.forEach(function (value, index) {
      value.ischecked = '0';
      if (value.code == code_) {
        vm.data.servicelist[index].ischecked = '1';
      }
    });
    this.setData({
      servicelist: this.data.servicelist,
      serviceRoute: code_,
      route: code_
    });
  },
  //服务商点击
  fwsClick: function (obj) {
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var title_ = obj.target.dataset.title || obj.currentTarget.dataset.title;
    var serviceId = this.data.serviceId;
    var serviceName = this.data.serviceTitle;
    var areaCode = this.data.serviceAreaCheckedData.regionID
    var areaName = this.data.serviceAreaCheckedData.title 
    wx.navigateTo({
      url: '../serviceDetails/serviceDetails?state=2&merchantId=' + code_ + '&merchantName=' + title_ + '&serviceId=' + serviceId + '&serviceName=' + serviceName + '&areaCode=' + areaCode + '&areaName=' + areaName
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm = this;
    this.setData({ serviceTitle: options.title, serviceId: options.code, areaCode: options.areaCode });
    //服务商列表
    wx.request({
      url: prot.GetMerchantListPageByService,
      method: 'GET',
      data: {
        args: {
          start: 0,
          limit: 10,
          sort: 'A.SortNo',
          dir: 'DESC',
          SpecialID: options.code
        }
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          data.forEach(function (value, index) {
            value.PicUrl = vm.data.api + value.PicUrl;
            var introduce = value.Introduce;
            var nodes = WxParse.wxParse('introduce' + index, 'html', introduce, vm, 5);
            data[index]['nodes'] = nodes;
          });
          vm.setData({ serviceData: data });
        }
      }
    });
    //服务地区
    wx.request({
      url: prot.GetRegionListByService,
      method: 'GET',
      data:{
        args:{
          ServiceID: options.code
        }
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          data = data.result;
          var city0 = [], city1 = [], city2 = {}, city3 = [];
          data.forEach(function(value){
            city0.push({
              title: value.Name,
              regionID: value.RegionID,
              code: value.Code,
              on: (value.RegionID == 1 ? 'on' : ''),
              parentId: value.ParentID,
              datalist: []
            });
            value.Children = value.Children ? value.Children : [];
            value.Children.forEach(function (value, index) {
              var index_ = index;
                if (value.ParentID == 1) {
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
              }
              value.Children = value.Children ? value.Children:[];
              value.Children.forEach(function(value){
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
              })
            });
          });
          city1.forEach(function (value) {
            value.datalist = city2[value.regionID];
          });
          city3.forEach(function (value) {
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
            serviceNavMinData1:city0,
            serviceAreaData: city1,
            serviceAreaData1: city1,
            serviceAreaMinData: city1.length>0?city1[0].datalist:[],
            serviceAreaData2: city3,
            serviceAreaMinData2: city3.length > 0 ?city3[0].datalist:[],
          });
          var serviceAreaDatas = [];
          if (options.areaCode == 1) {
            var data = [];
            vm.data.serviceNavMinData1.forEach(function (value, index) {
              if (index == 0) {
                value.on = 'on';
                data.push(value);
              }
            })
            vm.data.serviceNavMinData = data;
            serviceAreaDatas = vm.data.serviceAreaData1;
          } else if(options.areaCode == 2) {
            var data = [];
            vm.data.serviceNavMinData1.forEach(function (value, index) {
              if (index == 1) {
                value.on='on';
                data.push(value);
              }
            })
            vm.data.serviceNavMinData = data;
            serviceAreaDatas = vm.data.serviceAreaData2;
          } else if (options.areaCode == 0){
            var data = [];
            vm.data.serviceNavMinData1.forEach(function (value, index) {
              if (index == 0) {
                value.on = 'on';
              }
              data.push(value);
            })
            vm.data.serviceNavMinData = data;
            serviceAreaDatas = vm.data.serviceAreaData1;
          }
          vm.setData({
            serviceNavMinData: vm.data.serviceNavMinData,
            serviceAreaData: serviceAreaDatas,
            serviceAreaMinData: serviceAreaDatas[0].datalist
          });
        }
      }
    });
    //特色服务
    wx.request({
      url: prot.GetSpecialList,
      method: 'GET',
      success: function (res) {
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          vm.setData({
            featureData: data
          });
        }
      }
    });
    //列表轮播
    wx.request({
      url: prot.GetListBannerListPage,
      method: 'GET',
      data: {
        args: {
          start: 0,
          limit: 10,
          sort: 'SortNo',
          dir: 'DESC',
          NavCode: 'ListBanner'
        }
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          data.forEach(function (value, index) {
            value.PicUrl = vm.data.api + value.PicUrl;
          });
          vm.setData({
            streamerData: data
          });
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