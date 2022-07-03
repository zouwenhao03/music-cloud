import { getSongList } from '../../api/songList'
import pubsub from 'pubsub-js'
const app = getApp<IAppOption>();
Page({
    data: {
        recommendList: [],
        year: 0,
        month: 0,
        day: 0,
        index:0,//音乐列表数组的下标
    },
    onLoad() {
        console.log(app.globalData.hasLogin, 1111)
        this.getTime()
        this.getDayRecom();
        //订阅来自播放页面的消息
        pubsub.subscribe('switchMusic',(msg:string,type:string)=>{
            console.log(msg,type,1888888)
            let recommendList = this.data.recommendList;
            let index = this.data.index;
            if(type=='pre'){
                index -= 1;
            }else{
                //下一首
                index += 1
                console.log(index,'index')
            }
            //更新下标
            this.setData({
                index
            });
            let songId = recommendList[index].id;
            console.log(songId,'songId')
            //将音乐id回传给播放页
            pubsub.publish('songId',songId)
        })
    },
    //
    playAll() {
        let songs = this.data.recommendList
        let musicId = songs[0].id
        for (let i = 1; i < songs.length; i++) {
          app.globalData.waitForPlaying.push(songs[i].id)
        }
        // 跳转到播放页面
        wx.navigateTo({
          url: `../play/play?id=${musicId}`,
        })
      },
    //更新时间
    getTime(){
        let date = new Date();
        this.setData({year:date.getFullYear(),month:date.getMonth()+1})
        this.setData({day:date.getDate()})
    },
    //去播放界面
    toSongDetail(e:any){
        let id = e.currentTarget.dataset.song.id
        let index = e.currentTarget.dataset.index
        this.setData({
            index
        })
        wx.navigateTo({url:`/pages/play/play?id=${id}`})
    },
    //获取歌曲列表
    getDayRecom() {
        if (app.globalData.hasLogin) {
            getSongList()
                .then((res: any) => {
                    if (res.code == 200) {
                        this.setData({ recommendList: res.data.dailySongs })
                    }else{
                        wx.showToast({
                            title:res.msg,
                            icon:'none'
                        })
                    }
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }else{
            wx.showToast({
                title:'请先登录',icon:'none'
            })
        }
    }
})