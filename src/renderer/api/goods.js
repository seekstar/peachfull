import { query, transcaction, connquery } from '@/utils/mysql'

export async function getGoods(conds) {
  return request({
    url: '/goods',
    method: 'get',
    data: {
      conds: conds
    }
  })
}

export async function getMyGoods(seller, conds) {
  return request({
    url: '/mygoods',
    method: 'get',
    data: {
      seller: seller,
      conds: conds
    }
  })
}

export async function addMyGoods(seller, goods) {
  return request({
    url: '/mygoods/add',
    method: 'post',
    data: {
      seller: seller,
      goods: goods
    }
  })
}
export async function updateMyGoods(goods, goods_no) {
  return request({
    url: '/mygoods/update',
    method: 'post',
    data: {
      goods: goods,
      goods_no: goods_no
    }
  })
}
export async function updateGoodsImg(goods_no, url) {
  return request({
    url: '/mygoodsimg',
    method: 'post',
    data: {
      goods_no: goods_no,
      url: url
    }
  })
}

export async function deleteMyGoods(goods_no) {
  return request({
    url: '/mygoods/delete',
    method: 'post',
    data: {goods_no: goods_no}
  })
}
