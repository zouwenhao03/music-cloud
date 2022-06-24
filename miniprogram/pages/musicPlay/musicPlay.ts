import { getSongDetail, getSongUrl,getSongLyric } from '../../api/songList'
import moment from 'moment';
const app = getApp<IAppOption>();
//const moment =require('moment')
//创建控制音乐播放实例对象

Page({
    data: {
        songId: '',
        song: [],
        durationTime: '00:00',//总音乐时间
        currentTime: '00:00',//当前音乐时间
        url: '',
        isPlay: true,//歌曲是否播放
        hiddenLyric: true,//是否隐藏歌词
        lyric:[],

    },
    onLoad: function (op) {
        console.log(this, 20)
        if (op.id) {
            this.setData({ songId: op.id });
            this.getSongInfo(this.data.songId);
            this.playMusic(this.data.songId)
            this.getSongLyri(this.data.songId)
        }
        //判断单签页面是否有音乐播放
        if (app.globalData.isMusicPlay && app.globalData.musicId === this.data.songId) {
            //修改当前页面的音乐播放
            this.setData({
                isPlay: true
            })
        }
    },
    changePlayState(isPlay: boolean) {
        this.setData({
            isPlay: isPlay
        })
    },
    //播放音乐
    playMusic(musicId: string) {
        const that = this;
        app.globalData.musicId = musicId;

        getSongUrl(musicId)
            .then((res: any) => {
                //console.log(res)
                if (res.code == 200) {
                    that.createBackgroundAudioManager(res.data[0].url);
                }
            })
            .catch((err) => {
                throw err
            })    // 将当前音乐id传到全局

    },
    // 背景音频播放方法
    createBackgroundAudioManager(url: string) {
        const backgroundAudioManager = wx.getBackgroundAudioManager();
        if (url !== null) {
            if (backgroundAudioManager.src !== url) {
                this.setData({
                    currentTime: '00:00',
                })
                backgroundAudioManager.title = this.data.song.name
                backgroundAudioManager.src = url;
                console.log(backgroundAudioManager.duration,6777)
                this.setData({
                    durationTime:(backgroundAudioManager.duration/60)+''
                })
                console.log(this.data.durationTime)
                backgroundAudioManager.onPlay(()=>{
                    console.log(1111)
                })
            }
        }
    },
    //控制音频播放
    handleMusicPlay(){

    },
    //获取歌曲详情
    getSongInfo(id: string) {
        getSongDetail(id)
            .then((res: any) => {
                this.setData({
                    song: res.songs[0],
                })
                //更改title
                wx.setNavigationBarTitle({
                    title: res.songs[0].name
                })

            })
            .catch((err: object) => {
                console.log(err)
            })
    },
    //获取歌词
    async getSongLyri(id:string){
       let lyric = await getSongLyric(id)
       this.setData({lyric:lyric.lrc.lyric})
       console.log(this.data.lyric)
    }
})