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

// 获取文章列表
const queryObj = {
  status: '',
  channel_id: '',
  page: 1,
  per_page: 2
}
// 定义总条数变量
let tolcount = 0
// 将查询文章列表封装函数
async function getContentList() {
  const result = await axios({
    method: 'get',
    url: '/v1_0/mp/articles',
    params: queryObj
  })
  console.log(result);
  tolcount = result.data.total_count
  const htmlStr = result.data.results.map(item => `
    <tr>
      <td>
        <img src="${item.cover.type === 1 ? item.cover.images[0] : 'https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500'}" alt="">
      </td>
      <td>${item.title}</td>
      <td>
      ${item.status === 1 ? '<span class="badge text-bg-primary">待审核</span>' : '      <span class="badge text-bg-success">审核通过</span>'}
      </td>
      <td>${item.pubdate}</td>
      <td>${item.read_count}</td>
      <td>${item.comment_count}</td>
      <td>${item.like_count}</td>
      <td data-id="${item.id}">
        <i class="iconfont icon-wenbenshuru edit"></i>
        <i class="iconfont icon-shanchu del"></i>
      </td>
    </tr>
    `).join('')
  // console.log(htmlStr);
  document.querySelector('tbody').innerHTML = htmlStr
  document.querySelector('.total-count').innerHTML = `共${tolcount}条`
}
getContentList()

// 监听筛选条件改变，保存信息
document.querySelectorAll('.form-check-input').forEach(radio => {
  radio.addEventListener('change', e => {
    // console.log(e.target.value);
    queryObj.status = e.target.value
  })
})
// 筛选频道改变，保存信息
document.querySelector('.form-select').addEventListener('change', e => {
  // console.log(e.target.value);
  queryObj.channel_id = e.target.value
})
// 点击筛选 查询服务器
document.querySelector('.btn').addEventListener('click', () => {
  getContentList()
})

// 分页功能
// 点击下一页 判断条件 请求数据
document.querySelector('.next').addEventListener('click', e => {
  if (queryObj.page < Math.ceil(tolcount / queryObj.per_page)) {
    queryObj.page++
    document.querySelector('.page-now').innerHTML = `第${queryObj.page}页`
    getContentList()
  }
})
// 点击上一页 判断条件 请求数据
document.querySelector('.Previous').addEventListener('click', e => {
  if (queryObj.page > 1) {
    queryObj.page--
    document.querySelector('.page-now').innerHTML = `第${queryObj.page}页`
    getContentList()
  }
})

// 删除功能
document.querySelector('.art-list').addEventListener('click', async e => {
  // console.log(e.target);
  if (e.target.classList.contains('del')) {
    // 得到删除的文章id
    const delId = e.target.parentNode.dataset.id
    // console.log(delId);
    const res = await axios({
      url: `/v1_0/mp/articles/${delId}`,
      method: 'delete'
    })
    // console.log(res);
    // 删除最后一页最后一条时 向前翻页
    const children = document.querySelector('.art-list').children
    // console.log(children);
    if (children.length === 1 && queryObj.page > 1) {
      queryObj.page--
      document.querySelector('.page-now').innerHTML = `第${queryObj.page}页`
    }

    // 重新展示文章内容列表
    getContentList()
  }
})

// 编辑功能
document.querySelector('.art-list').addEventListener('click', e => {
  if (e.target.classList.contains('edit')) {
    const delId = e.target.parentNode.dataset.id
    console.log(delId);
    location.href = `../publish/index.html?id=${delId}`
  }
})