// pages/searchAll/searchAll.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchVal:'',
    reserveListData:[],
    isNull:false
  },
  //服务列表点击
  reserveListDataClick: function (obj) {
    var code_ = obj.target.dataset.code || obj.currentTarget.dataset.code;
    var name_ = obj.target.dataset.name || obj.currentTarget.dataset.name;
    var area_ = obj.target.dataset.area || obj.currentTarget.dataset.area;
    var title_ = obj.target.dataset.title || obj.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../reserveDetails/reserveDetails?code=' + code_ + '&name=' + name_ + '&area=' + area_ + '&title=' + title_
    })
  },
  searchClick:function(){
    var the = this;
    var data = [
      { title: '私人保镖服务', serviceName: '香港卫安', serviceArea: '中国香港', code: '1', url: '/images/icon_list_1.png', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何' },
      { title: '家庭保镖服务', serviceName: '北京万家', serviceArea: '北京', code: '2', url: '/images/icon_list_1.png', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何' },
      { title: '物资押运', serviceName: '香港卫安', serviceArea: '中国香港', code: '3', url: '/images/icon_list_1.png', describe: '全国范围提供高端高危安全防范服务及解决方案，隆门镖局保镖公司您如何' }
    ];
    if (the.data.searchVal!=''){
      var datas = [];
      data.forEach(function (value) {
        if (value.title.indexOf(the.data.searchVal)>=0) {
          datas.push(value);
        }
      })
      if (datas.length==0){
        this.setData({
          isNull: true
        })
      }else{
        this.setData({
          isNull: false
        })
      }
    }else{
      var datas = data;
    }
    this.setData({
      reserveListData: datas
    })
  },
  searchInput:function(obj){
    this.setData({
      searchVal: obj.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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