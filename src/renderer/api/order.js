import { query, transcaction, connquery } from '@/utils/mysql'
import { Message } from 'element-ui'
export async function addOrder(token, goods, consignee) {
  return request({
    url: '/order',
    method: 'post',
    data: [token, goods, consignee]
  })
}

export async function getOrderForBuyer(token, state) {
  return request({
    url: '/order',
    method: 'get',
    data: ['buyer', token, state]
  })
}
export async function getOrderForSeller(token, state) {
  return request({
    url: '/order',
    method: 'get',
    data: ['seller', token, state]
  })
}

export async function updateOrder(order_no, state) {
  return request({
    url: '/order',
    method: 'post',
    data: ['update', order_no, state]
  })
}

export async function addExpress(order_no, express_name, express_number) {
  return request({
    url: '/express',
    method: 'post',
    data: [order_no, express_name, express_number]
  })
}
