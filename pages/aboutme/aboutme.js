//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      contab: "联系方式"
  },
  //打开地图
  openLocation: function(){
    var me = this;
    wx.openLocation({
      address: me.data.detailAddress,
      name: me.data.title,
      latitude: parseFloat(me.data.latitude),
      longitude: parseFloat(me.data.longitude),
      success: function(){
      },
      fail: function(){
      },
      complete: function(){
      }
    });
  },
  //拨打电话
  makePhoneCall: function(){
    var me = this;
    wx.makePhoneCall({
      phoneNumber: me.data.mobile
    });
  },
  //加载系统参数
  loadSysParam: function () {
    var me = this;
    var SysParam = Bmob.Object.extend("SysParam");
    var query = new Bmob.Query(SysParam);
    query.containedIn("code", ["SYS_LOGO", "SYS_TITLE", "SYS_ADDRESS", "SYS_MOBILE", "SYS_FAX", "SYS_ADDRESS_LATITUDE", "SYS_ADDRESS_LONGITUDE"]);
    query.find({
      success: function (results) {
        var sysParam = {};
        for (var i = 0; i < results.length; i++) {
          var code = results[i].get("code");
          var value = results[i].get("value");
          sysParam[code] = value;
        }
        me.setData({
          imgUrl: sysParam.SYS_LOGO,
          title: sysParam.SYS_TITLE,
          intro: sysParam.SYS_INTRO,
          address: sysParam.SYS_ADDRESS,
          detailAddress: sysParam.SYS_ADDRESS,
          mobile: sysParam.SYS_MOBILE,
          latitude: sysParam.SYS_ADDRESS_LATITUDE,
          longitude: sysParam.SYS_ADDRESS_LONGITUDE,
          fax: sysParam.SYS_FAX
        });
      },
      error: function (error) {
        console.log(error, "error");
      }
    });
  },
  onLoad: function () {
    var me = this;
    let sysParam = wx.getStorageSync("sysParam");
    if (!sysParam) {
      me.loadSysParam();
    }else{
      me.setData({
        imgUrl: sysParam.SYS_LOGO,
        title: sysParam.SYS_TITLE,
        intro: sysParam.SYS_INTRO,
        address: sysParam.SYS_ADDRESS,
        detailAddress: sysParam.SYS_ADDRESS,
        mobile: sysParam.SYS_MOBILE,
        latitude: sysParam.SYS_ADDRESS_LATITUDE,
        longitude: sysParam.SYS_ADDRESS_LONGITUDE,
        fax: sysParam.SYS_FAX
      });
    }
  }
})
