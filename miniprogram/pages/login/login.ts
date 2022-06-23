const app = getApp<IAppOption>();
import { getCaptcha, verifyCaptcha, logina,loginP } from "../../api/user";
Page({
  data: {
    phone: "",
    captcha: "",
    pwd:'',
    captchaDisable: false,
    captchamsg: "获取验证码",
    timer: null,
    loginType: '点击切换密码登录'
  },
  //切换登录方式
  changeLogin() {
    if (this.data.loginType == '点击切换密码登录') {
      this.setData({
        loginType: '点击切换验证码登录'
      })
    } else {
      this.setData({
        loginType: '点击切换密码登录'
      })
    }
  },

  //表单项内容发生改变
  handleInput(event: any) {
    let type = event.currentTarget.id;
    this.setData({
      [type]: event.detail.value,
    });
  },
  //倒计时
  countTime: function () {
    const count = 60;
    let times = 60;
    if (!this.data.timer) {
      this.setData({
        timer: setInterval(() => {
          if (times > 0 && times <= count) {
            this.setData({ captchamsg: `${times--}后获取` });
            this.setData({ captchaDisable: true });
          } else if (times === 0) {
            this.setData({ captchaDisable: false });
            this.setData({ captchamsg: "获取验证码" });
            clearInterval(this.data.timer);
            this.setData({ timer: null });
          }
        }, 1000),
      });
    }
  },
  //登录
  login: function () {
    if (this.data.loginType == '点击切换密码登录') {
      //验证验证码
      verifyCaptcha(this.data.phone, this.data.captcha)
        .then((res: any) => {
          if (res.code == 200 && res.data) {
            logina(this.data.phone, this.data.captcha).then((res: any) => {
              if (res.code == 200) {
                // wx.setStorageSync('userInfo', JSON.stringify(res.profile));
                wx.setStorageSync('userId', res.account.id)
                wx.reLaunch({ url: '/pages/my/my' })
              }
            })
          }else{
            wx.showToast({
              title:res.msg,
              icon:'none'
            })
          }
        })
        .catch((err)=>{
          wx.showToast({
            title:err,
            icon:'none'
          })
        })
    }else if(this.data.loginType == '点击切换验证码登录'){
      if(this.data.phone&&this.data.pwd){
        loginP(this.data.phone,this.data.pwd)
        .then((res:any)=>{
          if(res.code==200){
            wx.setStorageSync('userId', res.account.id)
            wx.reLaunch({ url: '/pages/my/my' })
            app.globalData.hasLogin = true
          }else{
            wx.showToast({
              title:res.msg,
              icon:'none'
            })
          }
        })
        .catch((err)=>{
          wx.showToast({
            title:err,
            icon:'none'
          })
        })
      }else{
        wx.showToast({
          title:'请输入完整信息',
          icon:'none'
        })
      }
    }
  },
  //获取验证码
  getChpcthaNum: function (): any {
    console.log(this.data.phone, 16666);
    if (!/^1[0-9]{10}$/.test(this.data.phone)) {
      wx.showToast({
        title: "请输入正确的手机号",
        icon: "none",
      });
      return false;
    }
    getCaptcha(this.data.phone)
      .then((res: any) => {
        if (res.code == 200 && res.data) {
          wx.showToast({
            title: "发送验证码成功",
            icon: "none",
          });
          this.countTime();
          // this.setData({captchaDisable:true})
        }
      })
      .catch((err: any) => {
        wx.showToast({
          title: err.message,
        });
      });
  },

  onLoad() {
    // let phone = '13588824132';
  },
});
