// 登录收集表单数据
document.querySelector('.btn').addEventListener('click', () => {
  const form = document.querySelector('.login-form')
  const data = serialize(form, { hash: true, empty: true })
  console.log(data);
  if (data.mobile.length !== 11) {
    myAlert(false, '手机号码长度须为11位')
    return
  } else if (data.code.length !== 6) {
    myAlert(false, '验证码长度须为6位')
    return
  }
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