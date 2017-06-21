var app = getApp()
var dialog = require("../../utils/dialog")

Page({
  data: {
    album: [],
    title: '',
    id: '',
    countShow: true,
    imgSrc: '',
    currentIndex: 1,
    baseWidth: "400",
    baseHeight: "400",
    oldScale: 1,
    scaleWidth: "400",
    scaleHeight: "400",
    oldDistance: 0
  },
  onLoad: function (options) {
    this.setData({
      title: options.title,
      id: options.id,
      imgSrc: options.imgSrc,
      imgUrls: wx.getStorageSync('imgUrls'),
      album: [{
        id: options.id,
        src: options.imgSrc
      }, {
        title: "456",
        id: "456",
        src: "/images/list/6001.jpg"
      }, {
        title: "456",
        id: "456",
        src: "/images/list/6002.jpg"
      }]
    })
    /*dialog.loading()
    //请求数据
    var that = this
    wx.request({
      url:app.globalData.api.albumBaseurl+options.id,
      success:function(ret){
        ret = ret['data']
        if(ret['showapi_res_code'] == 0 && ret['showapi_res_body']){
          that.setData({
          album:ret['showapi_res_body']['imgList']
          })
        }else{
          dialog.toast("网络出错啦~")
        }
      },
      complete:function(){
        setTimeout(function(){
          dialog.hide()
        },1000)
      }
    })*/
  },
  onReady: function () {
    var me = this;
    wx.setNavigationBarTitle({ title: this.data.title });
    wx.getSystemInfo({
      success: function(res){
        me.setData({
          baseHeight: res.windowHeight * 0.8,
          scaleHeight: res.windowHeight * 0.8,
          baseWidth:res.windowWidth,
          scaleWidth:res.windowWidth
        });
      }
    });
  },
  imageTapFn: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: this.data.imgUrls
    })
  },
  swiperChange: function (e) {
    this.setData({ currentIndex: parseInt(e.detail.current) + 1 });
  },
  imageLongTap: function (e) {
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        if (res.tapIndex == 0) {
          var imageSrc = e.currentTarget.dataset.src
          imageSrc = 'http://www.fsgjs.net/attached/image/product/l/201512261451109680_662289.jpg';
          wx.downloadFile({
            url: imageSrc,//imageSrc, 
            success: function (res) {
              wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function (res) {
                  dialog.toast("保存成功")
                },
                fail: function (e) {
                  dialog.toast("保存出错")
                }
              })
            },
            fail: function (e) {
              dialog.toast("图片下载失败")
            }
          })
        }
      }
    })
  },
  hideCount: function () {
    //this.setData({ countShow: false })
  },
  showView: function (e) {
    var me = this;
    wx.previewImage({
      current: e.target.dataset.src,
      urls: me.data.imgUrls
    })
  },
  touchmoveFn: function (e) {
    var me = this;
    if (e.touches.length == 2) {
      var xMove = e.touches[1].clientX - e.touches[0].clientX;
      var yMove = e.touches[1].clientY - e.touches[0].clientY;
      var newDistance = Math.sqrt(xMove * xMove + yMove * yMove);
      var oldDistance = me.data.oldDistance;
      me.setData({
        oldDistance: newDistance
      });
      var distanceDiff = newDistance - oldDistance;
      var oldScale = me.data.oldScale;
      var newScale = oldScale + 0.005 * distanceDiff;
      me.setData({
        oldScale: newScale,
        scaleWidth: newScale * me.data.baseWidth,
        scaleHeight: newScale * me.data.baseHeight
      });
    }
  }
})