import { getSongDetail, getSongUrl, getSongLyric } from "../../api/songList";
import moment from "moment";
import pubsub from 'pubsub-js'
const app = getApp<IAppOption>();
//const moment =require('moment')
//创建控制音乐播放实例对象
const backgroundAudioManager = wx.getBackgroundAudioManager();
Page({
  data: {
    songId: "",
    song: [],
    durationTime: "00:00", //总音乐时间
    currentTime: "00:00", //当前音乐时间
    isPlay: false, //歌曲是否播放
    hiddenLyric: true, //是否隐藏歌词
    lyric: [],
    musicLink:'',//歌曲链接
    currentWidth:0,//进度条实时宽度
  },
  onLoad: function (op) {
    //console.log(this, 20)
    if (op.id) {
      this.setData({ songId: op.id });
      this.getSongInfo(this.data.songId);
      //this.playMusic(this.data.songId);
      this.getSongLyri(this.data.songId);
      //判断单签页面是否有音乐播放
    }
    if (
      app.globalData.isMusicPlay &&
      app.globalData.musicId === this.data.songId
    ) {
      //修改当前页面的音乐播放
      this.setData({
        isPlay: true,
      });
    }
    backgroundAudioManager.onPlay(() => {
      this.changePlayState(true);
      app.globalData.musicId = this.data.songId;
    });
    backgroundAudioManager.onPause(() => {
      this.changePlayState(false);
    });
    backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
    });
    //音乐播放实时监听
    backgroundAudioManager.onTimeUpdate(()=>{
       let currentTime = moment(backgroundAudioManager.currentTime * 1000).format('mm:ss') ;
       let currentWidth = (backgroundAudioManager.currentTime/ backgroundAudioManager.duration) * 450
       this.setData({
        currentTime:currentTime,
        currentWidth : currentWidth
       })
    });
    //监听音乐自动播放结束，自动切换下一曲
    backgroundAudioManager.onEnded(()=>{
      console.log('end')
      //切换下一首
      pubsub.publish('switchMusic','next');
      //进度条为0，开始时间为0
      this.setData({
        currentTime:'00:00',
        currentWidth:0
      })
    })
  },
//切换音乐
handleSwitch(event:any){
  let type = event.currentTarget.id;
  //需要关闭单前页面的歌曲
  backgroundAudioManager.stop();
  //订阅来自上个页面传来的id
    pubsub.subscribe('songId',(msg:string,songId:string)=>{
      //获取歌曲信息
      this.getSongInfo(songId);
      //自动播放
      this.musicControl(true,songId);
      pubsub.unsubscribe('songId')
    });
    //发布消息,将切换类型告知上个页面
    pubsub.publish('switchMusic',type)

},


  //修改播放状态
  changePlayState(isPlay: boolean) {
    this.setData({
      isPlay,
    });
    app.globalData.isMusicPlay = isPlay;
  },
  //处理音乐暂停播放函数
  handlePlayState() {
    console.log(222);
    let isPlay = !this.data.isPlay;

    this.setData({ isPlay: isPlay });
    this.musicControl(isPlay, this.data.songId,this.data.musicLink);
  },
  //歌曲播放控制
  async musicControl(isPlay: boolean, songId: string,musicLink?:string) {
    if (isPlay) {
      //获取音频资源
      if(!musicLink){//判断是否有请求过资源
        let musicLinkDate = await getSongUrl(songId);
         musicLink = musicLinkDate.data[0].url;
         this.setData({
          musicLink
         })
         if (musicLink == null) {
          wx.showToast({
            title: "暂无资源",
            icon: "none",
          });
          return;
        }
      }
      this.setData({
        isPlay: isPlay,
      });
      backgroundAudioManager.src = musicLink;
      backgroundAudioManager.title = this.data.song.name;
    } else {
      backgroundAudioManager.pause();
    }
  },
  //控制音频播放
  handleMusicPlay() {},
  //获取歌曲详情
  getSongInfo(id: string) {
    getSongDetail(id)
      .then((res: any) => {
        this.setData({
          song: res.songs[0],
        });

        let durationTime = moment(res.songs[0].dt).format("mm:ss");
        this.setData({
          durationTime: durationTime,
        });
        //更改title
        wx.setNavigationBarTitle({
          title: res.songs[0].name,
        });
      })
      .catch((err: object) => {
        console.log(err);
      });
  },
  //获取歌词
  async getSongLyri(id: string) {
    let lyric = await getSongLyric(id);
    this.setData({ lyric: lyric.lrc.lyric });
    // console.log(this.data.lyric)
  },
});
