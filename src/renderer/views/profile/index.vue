<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="登录日志" name="timeline">
                <timeline :user="user" />
              </el-tab-pane>
              <el-tab-pane label="账户" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Timeline, Account },
  data() {
    return {
      user: {},
      activeTab: 'account'
    }
  },
  computed: {
    ...mapGetters([

      'token',
      'name',
      'phone',
      'avatar',
      'roles',
      'age',
      'sex'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        username: this.token,
        name: this.name,
        role: this.roles.join(' | '),
        phone: this.phone,
        avatar: this.avatar,
        age: this.age,
        sex: this.sex
      }
    }
  }
}
</script>
