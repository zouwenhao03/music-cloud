import service from "../utils/request";
export function getBanner() {
    return service('/banner',{})
}
//获取每日推荐

export function getRecommend() {
    return service('/personalized?limit=10',{})
}
//获取推荐列表页歌单
export function getRecommendSongs(id:string){
    return service(`/playlist/detail/?id=${id}`,{})
}
//排行榜
export function getTopList() {
    return service('/toplist/detail',{})
}
///personal_fm
export function getPersonFm() {
    return service('/personal_fm',{})
}