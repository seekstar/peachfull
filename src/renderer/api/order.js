import { query, transcaction, connquery } from '@/utils/mysql'
import { Message } from 'element-ui'
export async function addOrder(token, goods, consignee) {
  return request({
    url: '/order',
    method: 'post',
    data: {
      token: token,
      goods: goods,
      consignee: consignee
    }
  })
}

export async function getOrderForBuyer(token, state) {
  return request({
    url: '/order/buyer',
    method: 'get',
    data: {
      token: token,
      state: state
    }
  })
}
export async function getOrderForSeller(token, state) {
  return request({
    url: '/order/seller',
    method: 'get',
    data: {
      token: token,
      state: state
    }
  })
}

export async function updateOrder(order_no, state) {
  return request({
    url: '/order/update',
    method: 'post',
    data: {
      order_no: order_no,
      state: state
    }
  })
}

export async function addExpress(order_no, express_name, express_number) {
  return request({
    url: '/express',
    method: 'post',
    data: {
      order_no: order_no,
      express_name: express_name,
      express_number: express_number
    }
  })
}
