import service from "../utils/request";
export function getSongList(){
    return service('/recommend/songs',{})
}