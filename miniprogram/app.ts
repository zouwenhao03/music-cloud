// app.ts
App<IAppOption>({
  globalData: {
    hasLogin:false,
    musicId:-1,
    isMusicPlay:false,
    userId:0,
    waitForPlaying:[],
    history_songId:[],
    songName:'',
    backgroundAudioManager:{},
    login_token:'',
    navId:2
  },
  onLaunch() {
    if(wx.getStorageSync('userId')){
      this.globalData.hasLogin = true
    }
  
  },
})