import { query } from '@/utils/mysql'

export async function getComment(goods_no) {
  return request({
    url: '/comment',
    method: 'get',
    data: {goods_no: goods_no}
  })
}

export async function addComment(buyer, order_no, rating, comment) {
  return request({
    url: '/comment',
    method: 'post',
    data: {buyer: buyer, order_no: order_no, rating: rating, comment: comment}
  })
}
