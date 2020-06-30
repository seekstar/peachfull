<template>
  <div>
    <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="rules" ref="loginForm" label-position="left">
      <h3 class="title">桃饱网登录</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="password"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item>
        
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
       <el-form-item>
        <el-button style="width:100%;" :loading="loading" @click="signinFormVisible=true">
          注册
        </el-button>
      </el-form-item> 
      <div class="tips">
        
      </div>
    </el-form>
    
  </div>
  <div class="signinContainer">
    <el-dialog title="注册" :visible.sync="signinFormVisible">
      <el-form :model="signinForm" :rules="rules" ref="signinForm" >
        <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
          <el-input v-model="signinForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password"  label="密码" :label-width="formLabelWidth">
          <el-input v-model="signinForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="roles" label="我是" :label-width="formLabelWidth">
          <el-checkbox-group v-model="signinForm.roles">
            <el-checkbox label="买家"></el-checkbox>
            <el-checkbox label="卖家"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="name" label="昵称" :label-width="formLabelWidth">
          <el-input v-model="signinForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机" :label-width="formLabelWidth">
          <el-input v-model="signinForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="signinFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSignin">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  </div>
</template>

<script>

import { isvalidUsername } from '@/utils/validate'
import { signin } from '@/api/user'
import './TCaptcha.js'
export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      console.log(111)
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        phone: [{ required: true, trigger: 'blur' }],
        name: [{ required: true, trigger: 'blur' }],
        roles: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      pwdType: 'password',
      signinForm: {
        username: '',
        password: '',
        roles: ['买家'],
        name: '',
        phone: ''
      },
      signinFormVisible: false,
      formLabelWidth: '80px'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          var captcha1 = new TencentCaptcha('2050079011', resp=> {  
            
          if(resp.ret ==0){
            this.$message.info('登录中');
          this.$store.dispatch('Login', this.loginForm).then(() => {
            
            this.loading = false
            this.$message.info('登录成功');
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
          }
          })
          captcha1.show()
         
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSignin() {
      this.$refs.signinForm.validate(valid => {
        if (valid) {
          console.log(valid)
          this.loading = true
          signin(this.signinForm.username,
            this.signinForm.password,
            this.signinForm.roles,
            this.signinForm.name,
            this.signinForm.phone
          ).then(() => {
            this.loading = false
            this.$message.success('注册成功')
            this.signinFormVisible = false
          }).catch(() => {
            console.log(this.signinForm)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
