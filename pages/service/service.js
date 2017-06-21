// pages/service/service.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    let sysParam = wx.getStorageSync("sysParam");
    if (!sysParam) {
      me.loadSysParam();
    } else {
      me.setData({
        mobile: sysParam.SYS_MOBILE
      });
    }
  },
  //加载系统参数
  loadSysParam: function () {
    var me = this;
    var SysParam = Bmob.Object.extend("SysParam");
    var query = new Bmob.Query(SysParam);
    query.containedIn("code", ["SYS_MOBILE"]);
    query.find({
      success: function (results) {
        var sysParam = {};
        for (var i = 0; i < results.length; i++) {
          var code = results[i].get("code");
          var value = results[i].get("value");
          sysParam[code] = value;
        }
        me.setData({
          mobile: sysParam.SYS_MOBILE
        });
      },
      error: function (error) {
        console.log(error, "error");
      }
    });
  },

  //拨打电话
  makePhoneCall: function () {
    var me = this;
    wx.makePhoneCall({
      phoneNumber: me.data.mobile
    });
  }
})