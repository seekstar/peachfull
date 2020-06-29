import { query, transcaction, connquery } from '@/utils/mysql'

import request from '@/utils/request'
import { Message } from 'element-ui'
export async function login(username, password) {
  const result = await query('select available,expire from user where username=?', [username])
  if (result.length > 0) {
    const { available, expire } = result[0]
    if (available > 0 && expire < Date.now()) {
      const result1 = await query('select count(*) as success from user where username=? and password=?', [username, password])
      if (result1[0]['success'] === 1) {
        const result2 = await request({
          url: 'http://ip-api.com/json/?lang=zh-CN',
          method: 'get'
        })
        console.log(result2)
        const ip = result2.data['query']
        await query('insert into login_log set ?', [{ username, ip }])
      } else {
        await query('update user set available=3,expire=date_add(now(),INTERVAL 1 minute) where username=?', [username])
        Message.error('用户名或密码错误')
        throw Error('用户名或密码错误')
      }
    } else {
      Message.error('用户被锁定,请稍后再试')
      throw Error('用户被锁定')
    }
  } else {
    Message.error('用户名或密码错误')
    throw Error('用户名或密码错误')
  }
}

export async function getRole(token) {
  const result = await query('select role from user_role where username=?', [token])
  return result.map(row => row['role'])
}

export async function getInfo(token) {
  const result = await query('select * from user_info where username=?', [token])
  return result[0]
}

export async function updateInfo(token, info) {
  delete info.role
  delete info.username
  await query('update user_info set ? where username=?', [info, token])
}

export async function updateAvatar(token, avatar) {
  await query('update user_info set avatar=? where username=?', [avatar, token])
}

export async function updatePassword(token, old, password) {
  const result = await query('select count(*) as success from user where username=? and password=?', [token, old])
  if (result[0]['success']) {
    await query('update user set password=? where username=?', [password, token])
  } else {
    Message.error('原密码错误')
    throw Error('用户名或密码错误')
  }
}

export async function signin(username, password, roles, name, phone) {
  await transcaction(async(conn) => {
    await connquery(conn, 'insert into user set ?', { username, password })
    var sql = 'insert into user_role (username,role) values '
    var masks = []
    var params = []
    roles.map(role => role === '买家' ? 'buyer' : 'seller').forEach(role => {
      masks.push('(?,?)')
      params.push(username)
      params.push(role)
    })
    sql += masks.join()
    await connquery(conn, sql, params)

    await connquery(conn, 'insert into user_info set ?', { username, name, phone })
  })
}

export async function getLog(token) {
  const result = await query('select * from login_log where username=? order by time desc', [token])
  return result
}

export async function logout() {
  return
}
