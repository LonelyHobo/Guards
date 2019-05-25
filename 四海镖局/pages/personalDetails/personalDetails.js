// pages/personalDetails/personalDetails.js
//获取应用实例

var util = require('../../utils/util.js');
const app = getApp();
var wxLocation = require('../../utils/wxLocation.js');
//接口
var prot = require('../../utils/prot.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: prot.api,
    userInfo: {
      Sex: '3',
      Nickname: '...',
      ImgUrl: '/images/icon_top.png',
      City: '...',
      Phone:'待完善',
    },
    multiIndex: 0,
    multiArray:['男','女','保密'],
    userCollectData: [],
    userLikeData: [],
    actionSheetHidden: true, // 是否显示底部可选菜单
    userDetailsData: {
      birthday: '待完善',
      tel: '待完善',
    },
    userKey: '',
    locations: '... ...',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hiddenmodalput: true,
    firmName:'请输入：',
    firmValue:'',
  },
  //生日选择
  bindTimeChange:function(e){
    var date_ = e.detail.value;
    var vm = this;
    vm.data.userInfo.Birthday = date_
    vm.changeData(vm.data.userInfo);
  },
  //性别选择
  sexChange:function(e){
    var index_ = +e.detail.value;
    var vm = this;
    vm.data.userInfo.Sex = index_+1
    vm.changeData(vm.data.userInfo);
  },
  //修改信息
  changeData: function (userInfo){
    var vm = this;
    wx.request({
      url: prot.MemberInfoSave + '?WeSessionKey=' + vm.data.userKey,
      method: 'POST',
      data: JSON.stringify(userInfo),
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
          wx.showToast({
            title: '保存成功',
            mask: true,
            icon: 'success',
            duration: 2000,
          });
          vm.setData({
            userInfo: userInfo
          });
          wx.setStorage({
            key: 'userdata',
            data: userInfo
          });
        } else {
          wx.showToast({
            title: '保存失败',
            mask: true,
            icon: 'none',
            duration: 2000,
          });
        }
      }
    });
  },
  //修改手机
  changePhone:function(){
    wx.navigateTo({
      url: '../changePhone/changePhone?state=1'
    })
  },
  //所在城市点击
  locationFn:function(){
    wx.navigateTo({
      url: '../location/location?state=1'
    })
  },
  // 点击头像 显示底部菜单
  clickImage: function() {
    var vm = this;
    wx.showActionSheet({
      itemList: ['修改头像', '查看头像'],
      success(res) {
        if (res.tapIndex == 0) {
          vm.changeImage();
        } else {
          vm.viewImage();
        }
      },
      fail(res) {

      }
    })
  },
  // 上传头像
  changeImage: function() {
    var vm = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showLoading({
          title: '上传中...',
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片，只有一张图片获取下标为0
        var tempFilePaths = res.tempFilePaths[0];
        var HeadImg_ = vm.data.userInfo.HeadImg;
        util.uploadFile(prot.UploadImage, tempFilePaths, 'imgFile', {
          'ImgID': HeadImg_,
          'WeSessionKey': vm.data.userKey
        }, function(res) {
          wx.hideLoading();
          res = typeof (res) === 'string' ? JSON.parse(res) : res;
          var data = typeof (res) === 'string' ? JSON.parse(res) : res;
          vm.data.userInfo.ImgUrl = prot.api+data.result;
          vm.setData({
            userInfo: vm.data.userInfo
          });
          wx.setStorage({
            key: 'userdata',
            data: vm.data.userInfo
          });
          if (null != res) {
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            // 显示消息提示框
            wx.showToast({
              title: '上传失败',
              icon: 'error',
              duration: 2000
            })
          }
        });
      }
    })
  },
  //点击按钮痰喘指定的hiddenmodalput弹出框
  modalinput: function(obj) {
    var name = obj.target.dataset.name || obj.currentTarget.dataset.name;
    var val = obj.target.dataset.value || obj.currentTarget.dataset.value;
    this.setData({
      firmName: name,
      firmValue: val,
      hiddenmodalput: !this.data.hiddenmodalput
    })

  },
  //取消按钮
  cancel: function() {
    this.setData({
      firmValue:'',
      hiddenmodalput: true
    });
  },
  //确认
  confirm: function(obj) {
    var vm = this;
    this.setData({
      hiddenmodalput: true
    });
    if (vm.data.firmName =='请输入名称'){
      vm.data.userInfo.Nickname = vm.data.firmValue
    } else if (vm.data.firmName == '请输入城市地址'){
      vm.data.userInfo.City = vm.data.firmValue
    }
    vm.changeData();
  },
  firmInput: function (obj){
    var vm = this;
    vm.setData({
      firmValue: obj.detail.value
    });
  },
  //退出登陆
  loginout: function(obj) {
    app.globalData.userInfo = null;
    wx.navigateTo({
      url: '../index/index'
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getPhoneNumber(e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var vm = this;
    wx.getStorage({
      key: 'userKey',
      success: function(res) {
        vm.setData({
          userKey: res.data.key
        });
        vm.getUserCollect(res.data.key);
      }
    });
    wx.getSystemInfo({
      success: function(res) {
        vm.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
  },
  collectList: function () {
    wx.navigateTo({
      url: '../collectList/collectList'
    });
  },
  likeList:function(){
    wx.navigateTo({
      url: '../likeList/likeList'
    });
  },
  //获取收藏点赞数据
  getUserCollect: function(key) {
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
        },
        WeSessionKey: key
      },
      success: function(res) {
        if (res.statusCode == 200) {
          var data = typeof(res.data) === 'string' ? JSON.parse(res.data) : res.data;
          vm.setData({
            userCollectData: data.result,
          });
        }
      }
    });
    wx.request({
      url: prot.GetLikeListPage,
      method: 'GET',
      data: {
        args: {
          start: 0,
          limit: 10,
          sort: 'A.CreatedDate',
          dir: 'DESC',
        },
        WeSessionKey: key
      },
      success: function(res) {
        if (res.statusCode == 200) {
          var data = typeof(res.data) === 'string' ? JSON.parse(res.data) : res.data;
          vm.setData({
            userLikeData: data.result,
          });
        }
      }
    });
  },
  // 查看原图
  viewImage: function() {
    var vm = this;
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [vm.data.userInfo.ImgUrl] // 需要预览的图片http链接列表
    })
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
    var vm = this;
    wx.getStorage({
      key: 'userdata',
      success: function (res) {
        vm.setData({
          userInfo: res.data,
          multiIndex: res.data.Sex == 1 ? 0 : res.data.Sex == 2 ? 1 : 2
        });
      }
    });
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