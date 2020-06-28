import { query } from '@/utils/mysql'

export async function addConsignee(token, consignee) {
  return request({
    url: '/consignee/add',
    method: 'post',
    data: {
      token: token,
      consignee: consignee
    }
  })
}

export async function updateConsignee(consignee, consignee_no) {
  return request({
    url: '/consignee/update',
    method: 'post',
    data: {
      consignee: consignee,
      consignee_no: consignee_no
    }
  })
}

export async function deleteConsignee(consignee_no) {
  return request({
    url: '/consignee/delete',
    method: 'post',
    data: {consignee_no: consignee_no}
  })
}
export async function getConsignee(token) {
  return request({
    url: '/consignee',
    method: 'get',
    data: {token: token}
  })
}
