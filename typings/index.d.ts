/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    hasLogin:boolean,
    musicId:-1,
    isMusicPlay:boolean,
    userId: 0,
    waitForPlaying: [],//等待播放歌单
    history_songId: [],//历史歌单
    songName: '',//歌名
    backgroundAudioManager: {},
    login_token: '',
    navId: 2
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}