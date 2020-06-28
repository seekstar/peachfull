import { query } from '@/utils/mysql'

export async function addCart(token, goods_no, num) {
  return request({
    url: '/cart/add',
    method: 'post',
    data: [token, goods_no, num]
  })
}

export async function deleteCart(cart_no) {
  return request({
    url: '/cart/delete',
    method: 'post',
    data: [cart_no]
  })
}

export async function updateCart(cart_no, num) {
  return request({
    url: '/cart/update',
    method: 'post',
    data: [cart_no, num]
  })
}
export async function getCart(token) {
  return request({
    url: '/cart',
    method: 'get',
    data: token
  })
}
