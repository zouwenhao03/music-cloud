import service from "../utils/request";
//获取验证码
export function getCaptcha(phone:string){
    return service(`/captcha/sent?phone=${phone}`,{})
}
//验证验证码

export function verifyCaptcha(phone:string,captcha:string){
    return service(`/captcha/verify?phone=${phone}&captcha=${captcha}`,{})
}
//验证码登录
export function logina(phone:string,captcha:string){
    return service(`/login/cellphone?phone=${phone}&captcha=${captcha}`,{isLogin:true})
}
//密码登录
export function loginP(phone:string,pwd:string){
    return service(`/login/cellphone?phone=${phone}&password=${pwd}`,{isLogin:true})
}
//获取用户信息
export function getUserInfo(userId:string){
    return service(`/user/detail?uid=${userId}`,{})
}
//user/playlist 获取用户歌单
export function getUserPlaylistApi(userId:string){
    return service(`/user/playlist?uid=${userId}`,{})
}
