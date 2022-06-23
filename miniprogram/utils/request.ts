import config from './config'
interface data{
    isLogin?:boolean
}

export default function service(url: string, data:data, method: any='GET') {
    return new Promise((resolve, reject) => {
            wx.request({
                url:`${config.host}${url}`,
                data:data,
                method:method,
                header: {
                    cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find((item:any) => item.indexOf('MUSIC_U') !== -1):''
                  },
                success:(res:any)=>{
                    // if(data.isLogin){//登录请求,将用户cookie存入
                    //     wx.setStorage({
                    //       key: 'cookies',
                    //       data: res.cookies,
                    //     })
                    if(data.isLogin){
                        wx.setStorageSync('cookies',res.cookies)
                    }
                    if(res.statusCode == 200){
                        resolve(res.data)
                    }else{
                        wx.showToast({
                            title:res.data.message,
                            icon:'none'
                        })
                    }
                    
                },
                fail:(err)=>{
                    console.log(err,133333)
                    reject(err)
                    
                }
            })
    })
}