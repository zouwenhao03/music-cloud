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
    return service(`/login/cellphone?phone=${phone}&captcha=${captcha}`,{})
}