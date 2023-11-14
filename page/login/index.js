// 登录收集表单数据
document.querySelector('.btn').addEventListener('click', () => {
  const form = document.querySelector('.login-form')
  const data = serialize(form, { hash: true, empty: true })
  console.log(data);

  axios({
    url: '/v1_0/authorizations',
    method: 'post',
    data
  }).then(result => {
    console.log(result);
    myAlert(true, '登录成功')
    // 登录成功后 保存token 跳转内容页面
    setTimeout(() => {
      localStorage.setItem('token', result.data.token)
      location.href = "../content/index.html"
    }, 1500);
  }).catch(error => {
    // console.log(error.response.data.message);
    myAlert(false, error.response.data.message)
  })
})