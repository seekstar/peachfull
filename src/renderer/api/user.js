import request from '@/utils/request'
import { Message } from 'element-ui'
export async function login(username, password) {
  const result = await request({
    url: '/user/login',
    method: 'get',
    data: {
      username: username,
      password: password
    }
  })
  if (result == 'wrong') {
    Message.error('用户名或密码错误')
    throw Error('用户名或密码错误')
  } else if (result == 'locked') {
    Message.error('用户被锁定,请稍后再试')
    throw Error('用户被锁定')
  }
}

export async function getRole(token) {
  return request({
    url: '/role',
    method: 'get',
    data: {token: token}
  })
}

export async function getInfo(token) {
  return request({
    url: '/info',
    method: 'get',
    data: {token: token}
  })
}

export async function updateInfo(token, info) {
  delete info.role
  delete info.username
  await request({
    url: '/user_info',
    method: 'post',
    data: {
      info: info,
      token: token
    }
  })
}

export async function updateAvatar(token, avatar) {
  await request({
    url: '/avatar',
    method: 'post',
    data: {
      avatar: avatar,
      token: token
    }
  })
}

export async function updatePassword(token, old, password) {
  const result = await request({
    url: '/user/login',
    method: 'post',
    data: {
      token: token,
      old: old,
      password: password
    }
  })
  if (result == 'wrong') {
    Message.error('原密码错误')
    throw Error('用户名或密码错误')
  }
}

export async function signup(username, password, roles, name, phone) {
  return request({
    url: '/signup',
    method: 'post',
    data: {
      username: username,
      password: password,
      roles: roles,
      name: name,
      phone: phone
    }
  })
}

export async function getLog(token) {
  return request({
    url: '/log',
    method: 'get',
    data: {token: token}
  })
}

export async function logout() {
  return
}
