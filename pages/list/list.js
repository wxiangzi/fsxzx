//index.js
//获取应用实例
var app = getApp()
var dialog = require("../../utils/dialog.js")
var wxNotificationCenter = require("../../utils/WxNotificationCenter.js")
var Bmob = require('../../utils/bmob.js');
Page({
  //加载第一个类型的列表
  onLoad: function () {
    this.initUI();
    let that = this
    if (!this.data.currentType) {
      this.data.types.every(function (item) {
        if (item.is_show) {
          wx.setStorageSync('currentType', item.value)
          that.setData({ currentType: item.value })
          return false
        } else {
          return true
        }
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 65
        });
      }
    });
    //this.getList(this.data.currentType, 1);
    //添加通知监听
    wxNotificationCenter.addNotification("typesChangeNotification", this.typesChangeNotificationHandler, this);
  },
  //初始化界面
  initUI: function() {
    var screenWidth = app.screenWidth;
    console.info(app)
    this.setData({
      screenWidth: screenWidth,
      beautyItemWidth: (screenWidth-60)/2,
      navBarScrollWidth: screenWidth - 80
    });
  },
  //接收类别编辑页面中修改了类别标签的通知，重新处理
  typesChangeNotificationHandler: function () {
    this.setData({
      types: wx.getStorageSync('types'),
      currentType: wx.getStorageSync('currentType')
    })
    this.getList(wx.getStorageSync('currentType'), 1)
  },
  getList: function (typeCode, curPage) {
    var me = this;
    if(curPage == 1) {//如果是加载第一页，先清空contentList
      dialog.loading();
      me.setData({
        contentList:[]
      });
      wx.setStorageSync('imgUrls', []);
    }
    var contentList = me.data.contentList;
    var imgUrls = wx.getStorageSync('imgUrls') || [];
    var Product = Bmob.Object.extend("Product");
    var query = new Bmob.Query(Product);
    query.equalTo("typeCode", typeCode);
    query.limit(me.data.pageSize);
    query.skip((curPage-1) * me.data.pageSize) 
    query.find({
      success: function (results) {
        if(results.length == 0) {
          me.setData({
            contentList: contentList,
            curPage: curPage,
            hasLoad: false,
            hasMore: false
          });
          return false;
        }
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          contentList.push({
            title: object.get("title"),
            id: object.get("id"),
            img: object.get("img")
          });
          imgUrls.push(object.get("img"));
        }
        wx.setStorageSync('imgUrls', imgUrls)
        me.setData({
          contentList: contentList,
          curPage: curPage,
          hasLoad:false,
          hasMore:true
        });
        dialog.hide();
      },
      error: function () {
        dialog.hide();
        dialog.toast("数据加载失败");
      }
    });
  },
  onPullDownRefresh: function () {
    this.getList(this.data.currentType, 1)
  },
  //点击某一个title条
  changeType: function (e) {
    var type = e.currentTarget.dataset.value
    if (type == this.data.currentType) {
      return;
    }
    this.setData({ currentType: type })
    app.globalData.currentType = type
    this.getList(type, 1)
  },
  gotoTypeEdit: function (e) {
    wx.navigateTo({
      url: '../types/types',
    })
  },
  gotoAlbum: function (e) {
    let param = e.currentTarget.dataset, title = param.title, id = param.id;
    wx.navigateTo({ url: "../album/album?title=" + title + "&id=" + id + "&imgSrc=" + param.imgsrc });
  },

  //设置转发分享
  onShareAppMessage: function () {
    title: app.sysParam.sysTitle
  },
  loadMore: function () {
    var me = this;
    me.setData({
      hasLoad: true
    });
    me.getList(this.data.currentType, me.data.curPage + 1);
  },
  refresh: function () {

  },
  data: {
    contentList: [],
    scrollHeight: 0,
    currentType: wx.getStorageSync('currentType'),
    types: wx.getStorageSync('types') ? wx.getStorageSync('types') : app.globalData.types,
    hasMore:true,
    navBarScrollWidth: 0,
    beautyItemWidth:0,
    pageSize:10,//每页显示量
    curPage:1//当前页数
  }
});
