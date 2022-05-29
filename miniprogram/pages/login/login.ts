const app = getApp<IAppOption>();
import { getCaptcha,verifyCaptcha,logina} from "../../api/user";
Page({
  data: {
    phone: "",
    captcha: "",
    captchaDisable: false,
    captchamsg: "获取验证码",
    timer: null,
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
 login:function(){
  //验证验证码
  verifyCaptcha(this.data.phone,this.data.captcha)
  .then((res:any)=>{
    if(res.code==200&&res.data){
      logina(this.data.phone,this.data.captcha).then((res)=>{
        if(res.code==200){}
      })
    }
  })


},
  //获取验证码
  getChpcthaNum: function () {
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
