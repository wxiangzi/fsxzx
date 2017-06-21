//app.js
var wxNotificationCenter = require("utils/WxNotificationCenter");
var Bmob = require('utils/bmob.js')
Bmob.initialize(
  "8562b9201137e7af9d427fa64910d293", //applicationid
  "b3acb463bdb9b47c1840cca16beb08f0", //restapi key
  "68031e6ff67816b274450cb806f71e83" //masterkey
);
App({
  onLaunch: function () {
    var me= this;
    //this.registerUser();
    //调用API从本地缓存中获取数据
    let types = wx.getStorageSync("types");
    if (!types) {
      this.setProductTypes();
    }
    let sysParam = wx.getStorageSync("sysParam");
    if (!sysParam) {
      this.loadSysParam();
    }
    // 设备信息
    wx.getSystemInfo({
      success: function (res) {
        me.screenWidth = res.windowWidth;
        me.screenHeight = res.windowHeight;
        me.pixelRatio = res.pixelRatio;
      }
    });
  },
  //注册用户
  registerUser: function () {
    var user = new Bmob.User();//开始注册用户

    var newOpenid = wx.getStorageSync('openid')
    if (!newOpenid) {
      wx.login({
        success: function (res) {
          user.loginWithWeapp(res.code).then(function (user) {
            var openid = user.get("authData").weapp.openid;

            if (user.get("nickName")) {
              // 第二次访问
              wx.setStorageSync('openid', openid)
            } else {
              //保存用户其他信息
              wx.getUserInfo({
                success: function (result) {
                  var userInfo = result.userInfo;
                  var nickName = userInfo.nickName;
                  var avatarUrl = userInfo.avatarUrl;
                  var u = Bmob.Object.extend("_User");
                  var query = new Bmob.Query(u);
                  // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                  query.get(user.id, {
                    success: function (result) {
                      // 自动绑定之前的账号
                      result.set('nickName', nickName);
                      result.set("userPic", avatarUrl);
                      result.set("openid", openid);
                      result.save();
                    }
                  });
                }
              });
            }
          }, function (err) {
            console.log(err, "注册用户失败");
          });
        }
      });
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  //设置商品类型
  setProductTypes: function () {
    var me = this;
    var ProductType = Bmob.Object.extend("ProductType");
    var query = new Bmob.Query(ProductType);
    query.find({
      success: function (results) {
        // 循环处理查询到的数据
        var hasCurerentType = false;
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          me.globalData.types.push({
            title: object.get("title"),
            value: object.get("value"),
            is_show: object.get("is_show")
          });
          if (!hasCurerentType && object.get("is_show")) {
            wx.setStorageSync('currentType', results[0].get("value")); 
            hasCurerentType = true;
          }
        }
        
        wx.setStorageSync("types", me.globalData.types);
        wxNotificationCenter.postNotificationName("typesChangeNotification")
      },
      error: function (error) {
        console.error(error, "查询失败");
      }
    });
  },
  //加载系统参数
  loadSysParam: function() {
    var me = this;
    var SysParam = Bmob.Object.extend("SysParam");
    var query = new Bmob.Query(SysParam);
    query.find({
      success: function (results) {
        console.log(results, "results");
        for(var i=0; i<results.length; i++) {
          var code = results[i].get("code");
          var value = results[i].get("value");
          me.sysParam[code] = value;
        }
        wx.setStorageSync("sysParam", me.sysParam);
        console.log(me.sysParam, "sysParam");
      },
      error: function (error) {
        console.log(error, "error");
      }
    });
  },
  globalData: {
    currentType: '',
    types: [

    ]
  },
  sysParam: {

  }
})