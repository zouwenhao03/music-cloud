import config from './config'
export default function service(url: string, data: object, method: any='GET') {
    return new Promise((resolve, reject) => {
            wx.request({
                url:`${config.host}${url}`,
                data:data,
                method:method,
                success:(res)=>{
                     resolve(res.data)
                },
                fail:(err)=>{
                    console.log(err,133333)
                    reject(err)
                    
                }
            })
    })
}