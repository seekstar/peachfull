import { query } from '@/utils/mysql'

export async function addConsignee(token, consignee) {
  return request({
    url: '/consignee',
    method: 'post',
    data: ['add', token, consignee]
  })
}

export async function updateConsignee(consignee, consignee_no) {
  return request({
    url: '/consignee',
    method: 'post',
    data: ['update', consignee, consignee_no]
  })
}

export async function deleteConsignee(consignee_no) {
  return request({
    url: '/consignee',
    method: 'post',
    data: ['delete', consignee_no]
  })
}
export async function getConsignee(token) {
  return request({
    url: '/consignee',
    method: 'get',
    data: [token]
  })
}
