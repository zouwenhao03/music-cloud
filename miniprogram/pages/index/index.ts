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
     // console.log(this.data.topList)
    })
  },
//跳转搜索页面
goSearchPage(){
  wx.navigateTo({url:'/pages/search/search'})
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
        console.log(res,41)
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
  //每日推荐(需要登录)
  goRecom(){
    wx.navigateTo({url:'/pages/recomPlay/recomPlay'})
  },
  //跳转推荐歌单的歌单列表页
  goPlayList(e:any){
    let listId = e.currentTarget.dataset.listid
    wx.navigateTo({url:`/pages/playList/playList?listId=${listId}`})
  }
});
