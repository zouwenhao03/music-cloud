import service from "../utils/request";
//获取推荐歌曲列表
export function getSongList(){
    return service('/recommend/songs',{})
}
//获取歌曲详情
export function getSongDetail(id:string){
    return service(`/song/detail?ids=${id}`,{})
}
//获取音乐 url
export function getSongUrl(id:string){
    return service(`/song/url?id=${id}`,{})
}
//获取歌词
export function getSongLyric(id:string){
    return service(`/lyric?id=${id}`,{})
}