import {getRecommendSongs} from '../../api/index'
Page({
    data:{
        listId:'',//歌单列表的id
        songsList:[]
    },
    onLoad(op){
        this.setData({
            listId:op.listId
        })
        this.getListSongs()
    },
    //获取歌单的歌曲
   async  getListSongs(){
       let songsList = await getRecommendSongs(this.data.listId)
       console.log(songsList)
    }
})