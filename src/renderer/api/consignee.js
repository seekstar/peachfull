import { query } from '@/utils/mysql'

export async function addConsignee(token, consignee) {
  consignee['buyer'] = token
  await query('insert into consignee set ?', [consignee])
}

export async function updateConsignee(consignee, consignee_no) {
  await query('update consignee set ? where consignee_no=?', [consignee, consignee_no])
}

export async function deleteConsignee(consignee_no) {
  await query('delete from consignee where consignee_no=?', [consignee_no])
}
export async function getConsignee(token) {
  const result = await query('select * from consignee where buyer=?', [token])
  return result
}
