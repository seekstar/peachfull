import { query, transcaction, connquery } from '@/utils/mysql'

export async function getGoods(conds) {
  const field = Object.keys(conds).map(
    key => key.replace('from', '>').replace('to', '<') + (key === 'name' || key === 'seller' ? ' like concat(\'%\',?,\'%\')' : '=?')
  )
  const sql = 'select goods.*,stock,sales from goods,stock where goods.goods_no=stock.goods_no' + (field.length > 0 ? ' and ' : '') + field.join(' and ')
  var params = Object.values(conds)
  const goods = await query(sql, params)
  return goods
}

export async function getMyGoods(seller, conds) {
  conds['seller'] = seller
  const field = Object.keys(conds).map(
    key => key.replace('from', '>').replace('to', '<') + (key === 'name' ? ' like concat(\'%\',?,\'%\')' : '=?')
  )
  const sql = 'select goods.*,stock,sales from goods,stock where goods.goods_no=stock.goods_no and ' + field.join(' and ')
  var params = Object.values(conds)
  const goods = await query(sql, params)
  return goods
}

export async function addMyGoods(seller, goods) {
  await transcaction(async(conn) => {
    goods['seller'] = seller
    const stock = goods['stock']
    delete goods['stock']
    await connquery(conn, 'insert into goods set ?', [goods])
    const result = await connquery(conn, 'select goods_no from goods where goods_no not in (select goods_no from stock)', [goods])
    const goods_no = result[0]['goods_no']
    await connquery(conn, 'insert into stock set ?', [{ goods_no, stock }])
  }
  )
}
export async function updateMyGoods(goods, goods_no) {
  await transcaction(async(conn) => {
    if (goods['stock']) {
      const stock = goods['stock']
      delete goods['stock']
      await connquery(conn, 'update stock set stock=? where goods_no=?', [stock, goods_no])
    }
    if (Object.keys(goods).length > 0) {
      await connquery(conn, 'update goods set ? where goods_no=?', [goods, goods_no])
    }
  })
}
export async function updateGoodsImg(goods_no, url) {
  await query('update goods set img=? where goods_no=?', [url, goods_no])
}

export async function deleteMyGoods(goods_no) {
  await query('delete from goods where goods_no=?', [goods_no])
}

