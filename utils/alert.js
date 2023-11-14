// 登录提示框封装函数
function myAlert(isSuccess, msg) {
  const alert = document.querySelector('.alert')
  alert.classList.add(isSuccess ? 'alert-success' : 'alert-danger')
  alert.innerHTML = msg
  alert.classList.add('show')

  // 2s消失
  setTimeout(() => {
    alert.classList.remove(isSuccess ? 'alert-success' : 'alert-danger')
    alert.innerHTML = ''
    alert.classList.remove('show')
  }, 2000);
}
