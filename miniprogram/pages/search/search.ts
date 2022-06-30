import { searchapi, searchHotApi, searcDefaultApi, searchHotTopicApi } from "../../api/search";
let isSend = false;//函数节流使用
Page({
    data: {
        searhVal: '',//搜索的内容
        searchList: [],//搜索结果
        hotSearchList: [],//热搜结果
        defaultSearch: '',
        hotTopic: [],
        historySearch: []
    },
    onLoad: function () {
        this.getSearchHot();
        this.getDefaultSearch();
        this.getHotTopic()
    },
    //  //获取本地历史记录
    getSearchHistory() {
        const historySearch = wx.getStorageSync('searchHistory');
        if (historySearch) {
            this.setData({
                historySearch: historySearch
            })
        }
    },
    //搜索
    search(e: any) {
        this.setData({
            searhVal: e.detail.value.trim()
        })
        if(isSend){
            return;
          }
          isSend = true;
        this.getSearchRes()
        setTimeout(()=>{
            isSend = false
        },1000)
    },
    //获取搜索结果
    async getSearchRes() {
        //当搜索内容为空时就不发送请求并清空内容
        if (!this.data.searhVal) {
            this.setData({
                searchList: []
            })
            return;
        }
        let res: any = await searchapi(this.data.searhVal)
        this.setData({
            searchList: res.result.songs
        })
        let searchVal = this.data.searhVal;
        let historySearch: any = this.data.historySearch;

        //将搜索关键字添加到历史记录
        if (historySearch.indexOf(searchVal) !== -1) {
            historySearch.splice(historySearch.indexOf(searchVal), 1)
        }
        historySearch.unshift(searchVal);

        this.setData({
            historySearch: historySearch
        })
        //存储到本地
        wx.setStorageSync('searchHistory', historySearch)
        console.log(res)
    },
    //清空搜索内容
    clearSearch() {
        this.setData({
            searchList: [],
            searhVal: ''
        })
    },
    //获取热搜
    async getSearchHot() {
        let res: any = await searchHotApi();
        this.setData({
            hotSearchList: res.data
        })
        console.log(this.data.hotSearchList)
    },
    //获取默认搜索
    async getDefaultSearch() {
        let res: any = await searcDefaultApi()
        this.setData({
            defaultSearch: res.data.realkeyword
        })
        console.log(res)
    },
    //获取热搜话题
    async getHotTopic() {
        let res: any = await searchHotTopicApi()
        this.setData({
            hotTopic: res.hot
        })
        console.log(res)
    },
    //
    goHotSearch(e:any){
        console.log(e)
        this.setData({
            searhVal:e.currentTarget.dataset.searchword
        })
        this.getSearchRes()
    },
    toSongDetail(e:any){
        console.log(e.currentTarget)
        let id = e.currentTarget.id
        wx.navigateTo({url:`/pages/musicPlay/musicPlay?id=${id}`})
    }
})