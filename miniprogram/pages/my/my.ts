import{getUserInfo} from '../../api/user'
const app = getApp<IAppOption>();
Page({
    data:{
        isLogin:false,
        userInfo:{},
        userId:null,
        years:0,
        level:0
    },
    onLoad(){
        if(wx.getStorageSync('userId')){
            this.setData({isLogin:true});
            let userId = wx.getStorageSync('userId')
            this.setData({userId:userId})
           if(this.data.userId){
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
    }
})