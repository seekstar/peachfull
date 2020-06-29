import { query } from '@/utils/mysql'

export async function addCart(token, goods_no, num) {
  await query('insert into cart set buyer=?,goods_no=?,num=?', [token, goods_no, num])
}

export async function deleteCart(cart_no) {
  await query('delete from cart where cart_no=?', [cart_no])
}

export async function updateCart(cart_no, num) {
  await query('update cart set num=? where cart_no=?', [num, cart_no])
}
export async function getCart(token) {
  const result = await query('select cart_no,num,stock,goods.* from cart,goods,stock where cart.goods_no=goods.goods_no and goods.goods_no=stock.goods_no and buyer=?', [token])
  return result
}
