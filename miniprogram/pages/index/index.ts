// index.ts
// 获取应用实例
import { getBanner, getRecommend,getTopList } from "../../api/index";
const app = getApp<IAppOption>();

Page({
  data: {
    bannerList: [],
    recommendList: [],
    topList:[]
  },

  onLoad() {
    this.getBannerList();
    this.getRecommendList();
    getTopList().then((res:any)=>{
      this.setData({topList:res.list})
      console.log(this.data.topList)
    })
  },

  //获取swiper
  getBannerList: function () {
    getBanner()
      .then((res: any) => {
        if (res.code == 200) {
          this.setData({ bannerList: res.banners });
        }
      })
      .catch((err) => {
        wx.showToast({
          title: `${err.code}`,
          icon: "error",
        });
      });
  },
  //获取每日推荐
  getRecommendList: function () {
    getRecommend()
      .then((res: any) => {
        if (res.code == 200) {
          this.setData({ recommendList: res.result });
        }
      })
      .catch((err) => {
        wx.showToast({
          title: err,
          icon: "error",
        });
      });
  },
  //每日推荐
  goRecom(){
    wx.navigateTo({url:'/pages/recomPlay/recomPlay'})
  }
});
