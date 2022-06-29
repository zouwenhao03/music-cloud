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
    musicLink: '',//歌曲链接
    currentWidth: 0,//进度条实时宽度
    lyricTime: 0,//歌词对应的时间
    currentLyric: '',//当前的歌词
    ly: '',//歌词
  },
  onLoad: function (op) {
    //取消监听上个页面的songid
    //pubsub.unsubscribe(sub)
    //console.log(this, 20)
    console.log(app.globalData.musicId, 'musicID')
    if (op.id) {
      console.log(op.id, 'songgID')

      this.setData({ songId: op.id });
      this.getSongInfo(this.data.songId);
      //this.playMusic(this.data.songId);
      this.getSongLyri(this.data.songId);
      //判断单签页面是否有音乐播放
      this.musicControl(true, this.data.songId)
      this.setData({
        currentTime: '00:00'
      })
    }
    if (
      app.globalData.isMusicPlay &&
      app.globalData.musicId === this.data.songId
    ) {
      //修改当前页面的音乐播放
      this.setData({
        isPlay: true,
      });
    } else {
      this.setData({
        isPlay: false
      })
    }
    this.setData({
      currentTime: '00:00'
    })
    console.log('onload', 45)
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
    backgroundAudioManager.onTimeUpdate(() => {
      this.musicPlayTime()
    });
    //监听音乐自动播放结束，自动切换下一曲
    backgroundAudioManager.onEnded(() => {
      console.log('end')
      //切换下一首
      pubsub.publish('switchMusic', 'next');
      //订阅来自上个页面传来的id
     pubsub.subscribe('songId', (msg: string, songId: string) => {
        //获取歌曲信息
        this.getSongInfo(songId);
        //自动播放
        this.musicControl(true, songId);
        pubsub.unsubscribe('songId')
      });
      //进度条为0，开始时间为0
      this.setData({
        currentTime: '00:00',
        currentWidth: 0
      });

    })
  },
  // 显示歌词
  showLyric() {
    this.setData({
      hiddenLyric: !this.data.hiddenLyric
    })
  },
  //切换音乐
  handleSwitch(event: any) {
    let type = event.currentTarget.id;
    //需要关闭单前页面的歌曲
    backgroundAudioManager.stop();
    pubsub.subscribe('listId',(msg:string,listId:string)=>{
      console.log(listId,103)
      pubsub.unsubscribe('listId')
    })

    //订阅来自上个页面传来的id
    pubsub.subscribe(`songId`, (msg: string, songId: string) => {
      console.log(msg,104)
      console.log(songId, 10444)
      //获取歌曲信息
      this.getSongInfo(songId);
      //自动播放
      this.musicControl(true, songId);
      pubsub.unsubscribe('songId')
    });
    //发布消息,将切换类型告知上个页面
    pubsub.publish('switchMusic', type)
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
    this.musicControl(isPlay, this.data.songId, this.data.musicLink);
  },
  //歌曲播放控制
  async musicControl(isPlay: boolean, songId: string, musicLink?: string) {
    if (isPlay) {
      //获取音频资源
      if (!musicLink) {//判断是否有请求过资源
        let musicLinkDate: any = await getSongUrl(songId);
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
      if (this.data.song) {
        backgroundAudioManager.title = this.data.song.name;
      }

    } else {
      backgroundAudioManager.pause();
    }
  },
  //
  onUnload: function () {
    console.log('Unload')
    pubsub.unsubscribe('songId')
  },

  //控制音频播放
  handleMusicPlay() { },
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
    let lyricData: any = await getSongLyric(id);
    //this.setData({ lyric: lyric.lrc.lyric });
    let lyric = this.formatLyric(lyricData.lrc.lyric)

  },
  //格式化歌词
  formatLyric(text: any) {
    let result: any = [];
    let arr = text.split('\n');
    let row = arr.length;
    for (let i = 0; i < row; i++) {
      let temp_row = arr[i];
      let temp_arr = temp_row.split(']');
      let text = temp_arr.pop();
      temp_arr.forEach((element: any) => {
        let obj: any = {};
        let time_arr = element.substr(1, element.length - 1).split(":");//先把多余的“[”去掉，再分离出分、秒
        let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[1]); //把时间转换成与currentTime相同的类型，方便待会实现滚动效果
        obj.time = s;
        obj.text = text;
        result.push(obj); //每一行歌词对象存到组件的lyric歌词属性里
      });
    }
    result.sort(this.sortRule)
    this.setData({
      lyric: result,
    })
    console.log(this.data.lyric, '201lyric')
  },
  sortRule(a: any, b: any) { //设置一下排序规则
    return a.time - b.time;
  },
  //控制歌词播放
  getCurrentLyric() {
    let j;
    for (j = 0; j < this.data.lyric.length - 1; j++) {
      if (this.data.lyricTime == this.data.lyric[j].time) {
        this.setData({
          currentLyric: this.data.lyric[j].text
        })
      }
    }
  },
  //观察音乐播放进度
  musicPlayTime() {
    //获取歌词对应的时间
    let lyricTime = Math.ceil(backgroundAudioManager.currentTime);
    let currentTime = moment(backgroundAudioManager.currentTime * 1000).format('mm:ss');
    let currentWidth = (backgroundAudioManager.currentTime / backgroundAudioManager.duration) * 450;
    this.setData({
      lyricTime, currentTime, currentWidth
    })
    this.getCurrentLyric();
  }

});
