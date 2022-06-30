import service from "../utils/request";
export function searchapi(keyWord:string) {
    return service(`/cloudsearch?keywords=${keyWord}`,{})
}
export function searchHotApi() {
    return service(`/search/hot/detail`,{})
}
//默认搜索关键词
export function searcDefaultApi() {
    return service('/search/default',{})
}
///hot/topic
export function searchHotTopicApi() {
    return service(`/hot/topic`,{})
}