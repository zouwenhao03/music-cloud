import config from './config'
export default function service(url: string, data: object, method: any='GET') {
    return new Promise((resolve, reject) => {
            wx.request({
                url:`${config.host}${url}`,
                data:data,
                method:method,
                header: {
                    cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
                  },
                success:(res:any)=>{
                    if(data.isLogin){//登录请求,将用户cookie存入
                        wx.setStorage({
                          key: 'cookies',
                          data: res.cookies,
                        })
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