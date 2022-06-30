import{getUserInfo,getUserPlaylistApi} from '../../api/user'
const app = getApp<IAppOption>();
Page({
    data:{
        isLogin:false,
        userInfo:{},
        userId:null,
        years:0,
        level:0,
        userPlaylist:[]
    },
    onLoad(){
        if(wx.getStorageSync('userId')){
            this.setData({isLogin:true});
            let userId = wx.getStorageSync('userId')
            this.setData({userId:userId})
           if(this.data.userId){
            this.getUserPlaylist()
            getUserInfo(this.data.userId).then((res:any)=>{
                if(res.code==200){
                    this.setData({level:res.level})
                   this.setData({userInfo:res.profile})
                   console.log(this.data.userInfo)
                   if(res.createDays>=365){
                   this.setData({years: Math.round(Number(res.createDays)/365)}) ;
                   }else{
                    this.setData({years:Number((res.createDays/365).toFixed(1))})
                   }
                }
            })
           }
        }
    },
    //goMyLike
    goMyLike(){
        let id = this.data.userPlaylist[0].id
        wx.navigateTo({url:`/pages/playList/playList?listId=${id}`})
    },
    //获取用户信息
    async getUserInfoData(){
        let res = await  getUserInfo(this.data.userId)
    },
    //获取用户歌单
    async getUserPlaylist(){
        let res:any =  await getUserPlaylistApi(this.data.userId)
        this.setData({
            userPlaylist:res.playlist
        })
        console.log(res)
    },
    gologin(){
        wx.navigateTo({url:'/pages/login/login'})
    }
})