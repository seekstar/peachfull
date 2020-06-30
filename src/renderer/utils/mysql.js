const mysql = require('mysql')
import { Message } from 'element-ui'
const pool = mysql.createPool({
  user: 'shop',
  password: 'zszengak47',
  host: '47.100.89.85',
  database: 'shop'
})

export function connquery(conn, sql, values) {
  return new Promise((res, rej) => {
    const query = conn.query(sql, values, (err, rows) => {
      if (err) {
        Message.error(err.message)
        rej(err)
      } else {
        res(rows)
      }
    })
    console.log(query.sql)
  })
}
export function getconn() {
  return new Promise((res, rej) => {
    pool.getConnection((err, conn) => {
      if (err) {
        Message.error(err.message)
        rej(err)
      } else {
        res(conn)
      }
    })
  })
}

export async function query(sql, values) {
  const conn = await getconn()
  const result = await connquery(conn, sql, values).finally(() => { conn.release() })
  return result
}

export function transcaction(func) {
  return new Promise((res, rej) => {
    pool.getConnection((err, conn) => {
      if (err) {
        rej(err)
      } else {
        conn.beginTransaction(err => {
          if (err) {
            conn.release()
            rej(err)
          } else {
            func(conn).then((result) => {
              conn.commit(err => {
                if (err) {
                  conn.rollback(() => {
                    conn.release()
                    rej(err)
                  })
                  conn.release()
                } else {
                  conn.release()
                  res(result)
                }
              })
            }
            ).catch(err => {
              conn.rollback(() => {
                conn.release()
                rej(err)
              })
            })
          }
        })
      }
    })
  })
}
