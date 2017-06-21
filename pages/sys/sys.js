var dialog = require("../../utils/dialog.js");
Page({
  clearData: function() {
    wx.clearStorage();
    dialog.toast("缓存清除成功！");
  }
})