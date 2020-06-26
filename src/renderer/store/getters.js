const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  phone: state => state.user.phone,
  roles: state => state.user.roles,
  sex: state => state.user.sex,
  age: state => state.user.age,
  permission_routes: state => state.permission.routes
}
export default getters
