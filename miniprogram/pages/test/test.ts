Page({
    onLoad() {
        const backgroundAudioManager = wx.getBackgroundAudioManager()
        backgroundAudioManager.title = '此时此刻'
        backgroundAudioManager.epname = '此时此刻'
        backgroundAudioManager.singer = '许巍'
        backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
        // 设置了 src 之后会自动播放
        backgroundAudioManager.src = 'http://m701.music.126.net/20220624151613/16d9a0b404c53e637382deedf51ae7ca/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/11842694562/84d6/aba4/6232/007e81efdeaba9af7f8706e41820752f.flac'
        console.log(backgroundAudioManager.src)
    },
})