let api_ = 'https://sh.szyinghe.net/api';
module.exports = {
  api: 'https://sh.szyinghe.net/',
  GetIndexBannerListPage: api_ + '/Service/GetIndexBannerListPage',//首页轮播
  GetSpecialList: api_ + '/Service/GetSpecialList',//特色服务
  GetServiceListPage: api_ + '/Service/GetServiceListPage',//服务列表
  GetMerchantListPage: api_ + '/Service/GetMerchantListPage',//首页服务商列表
  GetListBannerListPage: api_ + '/Service/GetListBannerListPage',//列表页轮播
  GetDetailBannerListPage: api_ + '/Service/GetDetailBannerListPage',//详情页轮播
  GetServiceDetail: api_ + '/Service/GetServiceDetail',//服务详情
  GetMerchantListPageByService: api_ + '/Service/GetMerchantListPageByService',//服务详情服务商列表
  GetMerchantDetail: api_ + '/Service/GetMerchantDetail',///服务商详情
  WxLogin: api_ + '/Member/WxLogin',///服务商详情
  GetRegionList: api_ + '/Service/GetRegionList',///服务地区
  MemberInfo: api_ + '/Member/MemberInfo',///获取信息
  GetRegionListAll: api_ + '/Service/GetRegionListAll',///获取所有服务地区
  GetServiceListPageByMerchant: api_ + '/Service/GetServiceListPageByMerchant',///服务详情服务列表
  GetRegionListByService: api_ + '/Service/GetRegionListByService',///根据服务、服务商获取地址
  OrderSave: api_ + '/Member/OrderSave',///订单提交
  LoginOut: api_ + '/Member/LoginOut',///退出登录
  GetOrderListPage: api_ + '/Member/GetOrderListPage',///订单列表
  GetAuthCode: api_ + '/Member/GetAuthCode',///发送验证码
  Help: api_ + '/Member/Help',///一键求助
  MemberInfoSave: api_ + '/Member/MemberInfoSave',///保存用户信息
  CreatedDate: api_ + '/Member/CreatedDate',///全部订单数据
  GetIsCollect: api_ + '/Member/GetIsCollect',///判断是否收藏
  GetIsLike: api_ + '/Member/GetIsLike',///判断是否点赞
  GetCollectListPage: api_ + '/Member/GetCollectListPage',///收藏数据
  CollectSave: api_ + '/Member/CollectSave',///添加收藏
  CollectDel: api_ + '/Member/CollectDel',///取消收藏
  GetLikeListPage: api_ + '/Member/GetLikeListPage',///点赞列表
  LikeSave: api_ + '/Member/LikeSave',///添加点赞
  LikeDel: api_ + '/Member/LikeDel',///取消点赞
};