//app.js
var prot = require('/utils/prot.js');
var wxLocation = require('/utils/wxLocation.js');
App({
  onLaunch: function() {
    var vm = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // try {
              //   var data = wx.getStorageSync("userKey");
              //   if (!data || data == '') {
              //     vm.loginRequest(res.userInfo,'',true);
              //   }
              // } catch (err) {
              //   vm.loginRequest(res.userInfo, '', true);
              // }
              vm.loginRequest(res.userInfo, '', true);
            }
          })
        }
      }
    });
  },
  loginRequest: function(userdata, fn, is) {
    if (!is) {
      wx.showLoading({
        title: '登录中...',
      })
    } else {
      wx.showLoading({
        title: '加载中...',
      })
    }
    var vm = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        //后台登录
        wx.request({
          url: prot.WxLogin,
          method: 'GET',
          data: {
            Code: code,
          },
          success: function(res) {
            if (res.statusCode == 200) {
              //登录成功
              var data = typeof(res.data) === 'string' ? JSON.parse(res.data) : res.data;
              //'91ce3fe0896408cf0b3893002de7c00b' || 
              var key = data.result;
              //保存用户id
              wx.setStorage({
                key: 'userKey',
                data: {
                  key: key,
                  code: code
                }
              });
              //获取个人信息
              wx.request({
                url: prot.MemberInfo,
                method: 'GET',
                data: {
                  Code: code,
                  WeSessionKey: key
                },
                success: function(res) {
                  if (res.statusCode == 200) {
                    var data = typeof(res.data) === 'string' ? JSON.parse(res.data) : res.data;
                    var data_ = data.result;
                    console.log('用户信息:', data);
                    //初步保存用户信息
                    wx.setStorage({
                      key: 'userlistdata',
                      data: data_
                    });
                    var province_ = wxLocation.wxLocation[userdata.province.toLowerCase()].cn;
                    var city_ = wxLocation.wxLocation[userdata.province.toLowerCase()].data[userdata.city.toLowerCase()];
                    var locations = wx.getStorageSync("locations");
                    data_.Nickname = vm.isNull(data_.Nickname, userdata.nickName);
                    data_.Sex = vm.isNull(data_.Sex, userdata.gender == 1 ? 1 : userdata.gender == 0 ? 2 : 0);
                    data_.Position = vm.isNull(data_.Position, locations.city);
                    if (locations.city != data_.Position){
                      locations.city = data_.Position
                      wx.setStorage({
                        key: 'locations',
                        data: locations
                      });
                      if (vm.locationsBack) {
                        vm.locationsBack()
                      }
                    }
                    var url_ = data_.ImgUrl;
                    data_.ImgUrl = vm.isNull(data_.ImgUrl, userdata.avatarUrl);
                    if (url_ == data_.ImgUrl && url_.indexOf(prot.api)==-1){
                      data_.ImgUrl = prot.api + data_.ImgUrl;
                    }
                    data_.City = vm.isNull(data_.City, province_ + ' ' + city_);
                    //重新保存
                    wx.request({
                      url: prot.MemberInfoSave + '?WeSessionKey=' + key,
                      method: 'POST',
                      data: JSON.stringify(data_),
                      success: function (res) {
                        if (res.statusCode == 200) {
                          var data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data;
                          wx.hideLoading();
                          typeof fn === 'function' ? fn(data_, key) : null;
                          if (vm.userInfoReadyCallback) {
                            vm.userInfoReadyCallback(data_, key)
                          }
                        } else {
                          wx.hideLoading();
                          wx.showToast({
                            title: '个人信息获取失败',
                            mask: true,
                            icon: 'none',
                            duration: 2000,
                          });
                        }
                      }
                    });
                    vm.globalData.userInfo = data_;
                    wx.setStorage({
                      key: 'userdata',
                      data: data_
                    });
                  } else {
                    wx.hideLoading();
                    wx.showToast({
                      title: '个人信息获取失败',
                      mask: true,
                      icon: 'none',
                      duration: 2000,
                    });
                  }
                }
              });
            } else {
              wx.hideLoading();
              wx.showToast({
                title: '登录失败',
                mask: true,
                icon: 'none',
                duration: 2000,
              });
            }
          }
        });
      }
    })
  },
  userCallBack: function(data) {
    console.log(data);
  },
  loginSuccess: function(data) {
    console.log(data);
  },
  userInfoReadyCallback: function(res) {
    this.globalData.userInfo = res.userInfo
  },
  globalData: {
    userInfo: null
  },
  isNull: function(obj, objs) {
    if (obj == '' || obj == null) {
      return objs;
    } else {
      return obj;
    }
  },
  locationsBack:function(){}
})