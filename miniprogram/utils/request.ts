import config from './config'
export default function service(url: string, data: object, method: any='GET') {
    return new Promise((resolve, reject) => {
            wx.request({
                url:`${config.host}${url}`,
                data:data,
                method:method,
                success:(res:any)=>{
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