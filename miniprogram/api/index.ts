import service from "../utils/request";
export function getBanner() {
    return service('/banner',{})
}
//获取每日推荐

export function getRecommend() {
    return service('/personalized?limit=10',{})
}

//排行榜
export function getTopList() {
    return service('/toplist/detail',{})
}