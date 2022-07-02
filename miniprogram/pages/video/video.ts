import {getRecomVieoApi,getVideoListApi,getVideoUrlApi} from '../../api/video'
Page({
    data:{
        recomVideoList:[],
        coverVideoList:[],
        videoUrl:'',
    },
    onLoad(){
        this.getRecomViedo()
        this.getCategoryList()
    },
    onReachBottom: function () {
        console.log(1111)
        this.getRecomViedo()
    },
    //获取推荐视频
    async getRecomViedo(){
        let res:any = await getRecomVieoApi()
        this.setData({
            recomVideoList:[...this.data.recomVideoList,...res.datas]
        })
       // console.log(this.data.recomVideoList)
    },
    async getCategoryList(){
        let res:any = await getVideoListApi()
        this.setData({
           coverVideoList:res.datas
        })
    },
    playVideo(e:any){
        let vid = e.currentTarget.dataset.vid
        getVideoUrlApi(vid)
        .then( (res:any) =>{
            this.setData({
                videoUrl:res.urls[0].url
            })
        })
    }
})