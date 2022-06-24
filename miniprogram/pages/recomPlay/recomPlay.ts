import { getSongList } from '../../api/songList'
const app = getApp<IAppOption>();
Page({
    data: {
        recommendList: [],
        year: 0,
        month: 0,
        day: 0
    },
    onLoad() {
        console.log(app.globalData.hasLogin, 1111)
        this.getTime()
        this.getDayRecom()
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
        wx.navigateTo({url:`/pages/musicPlay/musicPlay?id=${id}`})
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