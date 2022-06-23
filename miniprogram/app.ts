// app.ts
App<IAppOption>({
  globalData: {
    hasLogin:false,
  },
  onLaunch() {
    if(wx.getStorageSync('userId')){
      this.globalData.hasLogin = true
    }
  
  },
})