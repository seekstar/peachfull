import { query, transcaction, connquery } from '@/utils/mysql'
import { Message } from 'element-ui'
export async function addOrder(token, goods, consignee) {
  await transcaction(async(conn) => {
    delete consignee['consignee_no']
    for (let i = 0; i < goods.length; i++) {
      const item = goods[i]
      const num = item.num
      const goods_no = item['goods_no']
      const result = await connquery(conn, 'select * from stock where goods_no=?', [goods_no])
      const stock = result[0]['stock']
      const sales = result[0]['sales']
      const result1 = await connquery(conn, 'select name,seller,img from goods where goods_no=?', [goods_no])
      const { img, name, seller } = result1[0]
      if (stock >= num) {
        await connquery(conn, 'update stock set stock=?,sales=? where goods_no=?', [stock - num, sales + num, goods_no])
        const params = {
          ...consignee,
          seller,
          goods_no,
          name,
          price: item['price'],
          num,
          img
        }
        await connquery(conn, 'insert into `order` set ?', [params])
        const result2 = await connquery(conn, 'select order_no from `order` where order_no not in (select order_no from order_state)', [params])
        const order_no = result2[0]['order_no']
        const params1 = {
          order_no,
          state: '待发货'
        }
        await connquery(conn, 'insert into `order_state` set ?', [params1])
      } else {
        Message.error(item['name'] + '购买失败')
        return Promise.reject(item['name'] + '购买失败')
      }
    }
  })
}

export async function getOrderForBuyer(token, state) {
  let result
  if (state && state !== '全部') { result = await query('SELECT `order`.*,state,express_name,express_number FROM (`order` join `order_state` on `order`.order_no=`order_state`.order_no) left join express on `order`.order_no=express.order_no where buyer=? and state=? order by time desc', [token, state]) } else { result = await query('SELECT `order`.*,state,express_name,express_number FROM (`order` join `order_state` on `order`.order_no=`order_state`.order_no) left join express on `order`.order_no=express.order_no where buyer=? order by time desc', [token, state]) }
  return result
}
export async function getOrderForSeller(token, state) {
  let result
  if (state && state !== '全部') { result = await query('SELECT `order`.*,state,express_name,express_number FROM (`order` join `order_state` on `order`.order_no=`order_state`.order_no) left join express on `order`.order_no=express.order_no where seller=? and state=? order by time desc', [token, state]) } else { result = await query('SELECT `order`.*,state,express_name,express_number FROM (`order` join `order_state` on `order`.order_no=`order_state`.order_no) left join express on `order`.order_no=express.order_no where seller=? order by time desc', [token, state]) }
  return result
}

export async function updateOrder(order_no, state) {
  await query('update `order_state` set state=? where order_no=?', [state, order_no])
}

export async function addExpress(order_no, express_name, express_number) {
  await transcaction(async(conn) => {
    await connquery(conn, 'insert into express set ?', [{ order_no, express_name, express_number }])
    await connquery(conn, 'update `order_state` set state="已发货" where order_no=?', [order_no])
  })
}

