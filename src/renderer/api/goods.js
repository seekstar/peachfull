import { query, transcaction, connquery } from '@/utils/mysql'

export async function getGoods(conds) {
  return request({
    url: '/goods',
    method: 'get',
    data: conds
  })
}

export async function getMyGoods(seller, conds) {
  return request({
    url: '/mygoods',
    method: 'get',
    data: [seller, conds]
  })
}

export async function addMyGoods(seller, goods) {
  return request({
    url: '/mygoods',
    method: 'post',
    data: ['add', seller, goods]
  })
}
export async function updateMyGoods(goods, goods_no) {
  return request({
    url: '/mygoods',
    method: 'post',
    data: ['update', goods, goods_no]
  })
}
export async function updateGoodsImg(goods_no, url) {
  return request({
    url: '/mygoodsimg',
    method: 'post',
    data: [goods_no, url]
  })
}

export async function deleteMyGoods(goods_no) {
  return request({
    url: 'mygoods',
    method: 'post',
    data: ['delete', goods_no]
  })
}
