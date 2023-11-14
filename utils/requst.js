//公共配置 基地址
axios.defaults.baseURL = 'http://geek.itheima.net'

// 请求拦截器
// 请求之前设置参数
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = localStorage.getItem('token')
  token && (config.headers.Authorization = `Bearer ${token}`)
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


// 响应拦截器
// 响应之前设置返回参数
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么

  return response.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // console.log(error)
  if (error?.response?.status === 401) {
    alert('用户登录身份过期')
    localStorage.removeItem('token')
    location.href = '../login/登录.html'
  }
  return Promise.reject(error);
});