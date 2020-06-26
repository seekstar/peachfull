import { query } from '@/utils/mysql'

export async function addCart(token, goods_no, num) {
  return request({
    url: '/cart',
    method: 'post',
    data: ['add', token, goods_no, num]
  })
}

export async function deleteCart(cart_no) {
  return request({
    url: '/cart',
    method: 'post',
    data: ['delete', cart_no]
  })
}

export async function updateCart(cart_no, num) {
  return request({
    url: '/cart',
    method: 'post',
    data: ['update', cart_no, num]
  })
}
export async function getCart(token) {
  return request({
    url: '/cart',
    method: 'get',
    data: token
  })
}
