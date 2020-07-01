import { query } from '@/utils/mysql'

export async function getComment(goods_no) {
  const result = await query('select * from comment where goods_no=?', goods_no)
  return result
}

export async function addComment(buyer, order_no, rating, comment) {
  const result = await query('select goods_no from `order` where order_no=?', [order_no])
  const { goods_no } = result[0]
  await query('insert into comment set ?', { goods_no, order_no, rating, comment, buyer })
}
