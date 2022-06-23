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

    },
    getDayRecom() {
        if (app.globalData.hasLogin) {
            getSongList()
                .then((res: any) => {
                    if (res.code == 200) {
                        this.setData({ recommendList: res.data.dailySongs })
                    }
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }else{
            wx.showToast({
                title:'请先登录'
            })
        }
    }
})