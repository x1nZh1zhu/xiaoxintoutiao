
// 获取频道列表 封装函数
async function getChannelList() {
  const channel = await axios({
    url: '/v1_0/channels'
  })
  // console.log(channel)
  const channelList = channel.data.channels.map(item =>
    `
    <option value="${item.id}">${item.name}</option>
    `
  ).join('')
  // console.log(channelList)
  document.querySelector('.form-select').innerHTML = '<option selected>请选择文章频道</option>' + channelList
}
getChannelList()

let imgurl
// 设置封面图片
document.querySelector('.file-img').addEventListener('change', async e => {
  const file = e.target.files[0]
  // 用表单对象携带图片信息
  const fd = new FormData()
  fd.append('image', file)
  console.log(file)
  // 发送请求 返回图片url地址
  const fileUrl = await axios({
    url: '/v1_0/upload',
    method: 'POST',
    data: fd
  })
  // console.log(fileUrl.data.url);
  // 设置img标签图片地址
  // 解决点击图片不换封面后 img地址为空的bug
  if (file) imgurl = fileUrl.data.url
  // console.log(imgurl);
  document.querySelector('.cover-img').src = imgurl
  document.querySelector('.cover-img').classList.add('show')
  document.querySelector('.cover').classList.add('hidden')
})

// 点击图片切换封面图片 
document.querySelector('.cover-img').addEventListener('click', () => {

  document.querySelector('.file-img').click()
})

// 点击发布 收集表单元素
document.querySelector('.btn').addEventListener('click', async e => {
  // 发布
  if (e.target.innerHTML == '发布') {
    const form = document.querySelector('.publish-form')
    const data = serialize(form, { hash: true, empty: true })
    // 封面主动获取
    data.cover = {
      type: 1,
      images: [document.querySelector('.cover-img').src]
    }
    console.log(data);
    try {
      // 向服务器发送请求
      const res = await axios({
        url: '/v1_0/mp/articles',
        method: 'post',
        data
      })
      console.log(res)
      // 发送成功 提示成功 清空内容 跳转页面
      myAlert(true, '发布成功')
      form.reset()
      // 封面和内容要主动清除
      document.querySelector('.cover-img').src = ''
      document.querySelector('.cover-img').classList.remove('show')
      document.querySelector('.cover').classList.remove('hidden')
      editor.setHtml()
      // 提示框
      setTimeout(() => {
        location.href = '../content/index.html'
      }, 1500);
    } catch (error) {
      // 失败 提示失败
      console.log(error);
      myAlert(false, error.response.data.message)
    }
  } else {
    // 修改
    const form = document.querySelector('.publish-form')
    const data = serialize(form, { hash: true, empty: true })
    // 封面主动获取
    data.cover = {
      type: 1,
      images: [document.querySelector('.cover-img').src]
    }
    // console.log(data);
    try {
      // 向服务器发送请求
      const res = await axios({
        url: `/v1_0/mp/articles/${data.id}`,
        method: 'PUT',
        data
      })
      console.log(res)
      // 发送成功 提示成功 清空内容 跳转页面
      myAlert(true, '修改成功')
      form.reset()
      // 封面和内容要主动清除
      document.querySelector('.cover-img').src = ''
      document.querySelector('.cover-img').classList.remove('show')
      document.querySelector('.cover').classList.remove('hidden')
      editor.setHtml()
      // 提示框
      setTimeout(() => {
        location.href = '../content/index.html'
      }, 1500);
    } catch (error) {
      // 失败 提示失败
      console.log(error);
      myAlert(false, error.response.data.message)
    }
  }


})

  // 编辑内容
  ; (function () {
    // 拿到网址中的携带值
    const paramsStr = location.search
    // console.log(paramsStr);
    const params = new URLSearchParams(paramsStr)
    params.forEach(async (value, key) => {
      // 当id传入进来 表明编辑文章
      if (key === 'id') {
        document.querySelector('.card-header').innerHTML = '编辑文章'
        document.querySelector('.btn ').innerHTML = '修改'
        // 获取文章详情
        const res = await axios({
          url: `/v1_0/mp/articles/${value}`
        })
        console.log(res)
        // 修改页面显示
        document.querySelector('[name="title"]').value = res.data.title
        document.querySelector('[name="channel_id"]').value = res.data.channel_id
        // 富文本内容
        editor.setHtml(res.data.content)
        document.querySelector('[name="id"]').value = res.data.id
        // 如果有封面
        if (res.data.cover.images[0]) {
          document.querySelector('.cover-img').src = res.data.cover.images
          document.querySelector('.cover-img').classList.add('show')
          document.querySelector('.cover').classList.add('hidden')
        }
      }
    })
  })();