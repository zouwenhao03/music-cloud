import {getRecommendSongs} from '../../api/index'
import pubsub from 'pubsub-js'
Page({
    data:{
        listId:'',//歌单列表的id
        songsList:[],
        index:0
        },
    onLoad(op){
        this.setData({
            listId:op.listId
        })
        this.getListSongs()
          //订阅来自播放页面的消息
          pubsub.subscribe('switchMusic',(msg:string,type:string)=>{
            console.log(msg,type,1888888)
            let songsList = this.data.songsList.tracks;
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
            console.log(songsList,30)
            let songId = songsList[index].id;
            console.log(songId,'songId')
            //将音乐id回传给播放页
            pubsub.publish(`songId`,songId)
            pubsub.publish('listId',this.data.listId)
        })
    },
    //获取歌单的歌曲
   async  getListSongs(){
       let songsList:any = await getRecommendSongs(this.data.listId)
       this.setData({
        songsList:songsList.playlist
       })
       console.log(songsList,20)
    },
    //跳往播放页面
    toSongDetail(e:any){
        let id = e.currentTarget.dataset.song.id
        let index = e.currentTarget.dataset.index
        this.setData({
            index
        })
        wx.navigateTo({url:`/pages/musicPlay/musicPlay?id=${id}`})
    }
})