import service from "../utils/request";
export function getRecomVieoApi() {
    return service(`/video/timeline/recommend`,{})
}
export function getVideoListApi() {
    return service(`/video/group?id=60100`,{})
}
export function getVideoUrlApi(vid:string) {
    return service(`/video/url?id=${vid}`,{})
}