//内容管理界面 判断有无token令牌
const token = localStorage.getItem('token')
// 如果没有token 则返回登录页面
if (!token) {
  location.href = "../login/index.html"

}


// 获取个人信息
axios({
  url: '/v1_0/user/profile',
}).then(result => {
  // console.log(result)
  document.querySelector('.nickname').innerHTML = result.data.name
})

// 退出登录
document.querySelector('.quit').addEventListener('click', () => {

  localStorage.removeItem('token')
  location.href = '../login/index.html'
})