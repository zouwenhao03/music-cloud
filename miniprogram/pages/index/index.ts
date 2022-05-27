// index.ts
// 获取应用实例
import { getBanner } from "../../api/index"
const app = getApp<IAppOption>()

Page({
  data: {
    bannerList:[]
  },

  onLoad() {
    getBanner().then((res:any) => {
      console.log(res)
      if(res.code == 200){
        this.setData({bannerList:res.banners})
        console.log(this.data.bannerList,16666)
      }
      
    })
  },
  getData: () => {
    getBanner().then((res) => {
      console.log(res)
    }
    )
  }

})
