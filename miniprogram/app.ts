// app.ts
App<IAppOption>({
  globalData: {
    hasLogin:false,
    musicId:'',
    isMusicPlay:false
  },
  onLaunch() {
    if(wx.getStorageSync('userId')){
      this.globalData.hasLogin = true
    }
  
  },
})