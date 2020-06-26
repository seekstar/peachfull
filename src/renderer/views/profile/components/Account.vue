<template>
<div>
  <el-upload :http-request="Upload" action="" :show-file-list="false">
 <el-button size="small" type="primary">点击上传头像</el-button>
</el-upload>
  <el-form>
    <el-form-item label="昵称">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="手机">
      <el-input v-model.trim="user.phone" />
    </el-form-item>
    <el-form-item label="性别">
      <el-input v-model.trim="user.sex" />
    </el-form-item>
    <el-form-item label="年龄">
      <el-input v-model.trim="user.age" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
      <el-button  @click="passwordFormVisible=true">修改密码</el-button>
    </el-form-item>
  </el-form>
  <el-dialog title="改密" :visible.sync="passwordFormVisible">
      <el-form :model="passwordForm" :rules="rules" ref="passwordForm" >
        <el-form-item prop="oldpassword" label="原密码" :label-width="formLabelWidth">
          <el-input v-model="passwordForm.oldpassword" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="新密码" :label-width="formLabelWidth">
          <el-input v-model="passwordForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword" label="确认密码" :label-width="formLabelWidth">
          <el-input v-model="passwordForm.repassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import { client } from '@/utils/alioss'
import { updatePassword } from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: '',
          name: '',
          phone: '',
          sex: '',
          age: ''
        }
      }
    }
  },
  data() {
    return {
      rules: { password: [{ required: true, trigger: 'blur', min: 5 }],
        repassword: [{ required: true, trigger: 'blur', min: 5 }],
        oldpassword: [{ required: true, trigger: 'blur', min: 5 }] },
      passwordFormVisible: false,
      fileList: [],
      formLabelWidth: '100px',
      passwordForm: {}
    }
  },
  methods: {
    async changePassword() {
      if (this.passwordForm.password === this.passwordForm.repassword) {
        await updatePassword(this.user.username, this.passwordForm.oldpassword, this.passwordForm.password)
        this.passwordFormVisible = false
        this.$message.success('修改成功')
      } else {
        this.$message.error('密码不一致')
      }
    },
    async Upload(file) {
      const fs = require('fs')
      const content = fs.readFileSync(file.file.path)
      var fileName = 'avatar' + file.file.uid + '.' + file.file.type.split('/')[1]
      // 定义唯一的文件名，打印出来的uid其实就是时间戳
      const result = await client().put(fileName, content)
      await this.$store.dispatch('UpdateAvatar', result.url)
      this.$message.success('上传成功')
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M && isPNG
    },
    async submit() {
      await this.$store.dispatch('UpdateInfo', this.user)
      this.$message.success('修改成功')
    }
  }
}
</script>
