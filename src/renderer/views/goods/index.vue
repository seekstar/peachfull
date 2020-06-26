<template>
  <div class="app-container">
    <el-form :model="headerform" :inline="true" style="text-align:center">
      <el-form-item label="商品序号">
        <el-input v-model="headerform.goods_no" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item label="商品名">
        <el-input v-model="headerform.name" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="headerform.pricefrom" style="width:100px"></el-input>
        <span>-</span>
        <el-input v-model="headerform.priceto" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="select">查询</el-button>
        <el-button @click="form={};img=null;insertFormVisible = true">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data" stripe height="500" v-loading="loading">
      <el-table-column prop="goods_no" label="商品序号" sortable width="100" align="center"></el-table-column>
      <el-table-column prop="name" label="商品名" sortable width="100" align="center"></el-table-column>
      <el-table-column prop="price" label="价格" sortable width="100" align="center"></el-table-column>
      <el-table-column prop="old_price" label="市场价" sortable width="100" align="center"></el-table-column>
      <el-table-column prop="stock" label="库存" sortable width="100"  ></el-table-column>
      <el-table-column prop="sales" label="销量" sortable width="100"  ></el-table-column>
      <el-table-column prop="info" label="商品详情" ></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="form={...scope.row};row=scope.row;editFormVisible = true"
          >编辑</el-button>
          <el-popconfirm title="确定删除该商品吗？" @onConfirm="deleteRow(scope.row)">
            <el-button size="mini" type="danger" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="插入" :visible.sync="insertFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
  class="avatar-uploader"
  :http-request="insertUpload" action=""
  :show-file-list="false"
  
  >
  <img v-if="img" :src="img" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
        </el-form-item>
        <el-form-item label="商品名" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价" :label-width="formLabelWidth">
          <el-input v-model="form.old_price"></el-input>
        </el-form-item>
        <el-form-item label="库存" :label-width="formLabelWidth">
          <el-input v-model="form.stock"></el-input>
        </el-form-item>
        <el-form-item label="商品详情" :label-width="formLabelWidth">
          <el-input v-model="form.info"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insert">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editFormVisible">
     
      <el-form :model="form" :rules="rules">
        
<el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
  class="avatar-uploader"
  :http-request="Upload" action=""
  :show-file-list="false"
  
  >
  <img v-if="row.img" :src="row.img" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
        </el-form-item>
        <el-form-item label="商品名" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价" :label-width="formLabelWidth">
          <el-input v-model="form.old_price"></el-input>
        </el-form-item>
        <el-form-item label="库存" :label-width="formLabelWidth">
          <el-input v-model="form.stock"></el-input>
        </el-form-item>
        <el-form-item label="商品详情" :label-width="formLabelWidth">
          <el-input v-model="form.info"></el-input>
        </el-form-item>
      </el-form>
       
      <div slot="footer" class="dialog-footer">
        
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { client } from '@/utils/alioss'
import { getMyGoods, updateMyGoods, deleteMyGoods, addMyGoods, updateGoodsImg } from '@/api/goods'
export default {
  name: 'dashboard',
  data: () => {
    return {
      loading: false,
      insertFormVisible: false,
      editFormVisible: false,
      formLabelWidth: '80px',
      data: [],
      form: {},
      row: {},
      img: null,
      headerform: {},
      rules: { name: [{ required: true, trigger: 'blur' }],
        price: [{ required: true, trigger: 'blur' }],
        stock: [{ required: true, trigger: 'blur' }] }

    }
  },
  computed: {
    ...mapGetters([
      'token',
      'name',
      'roles'
    ])
  },
  methods: {
    async insertUpload(file) {
      const fs = require('fs')
      const content = fs.readFileSync(file.file.path)
      var fileName = 'goods' + file.file.uid + '.' + file.file.type.split('/')[1]
      // 定义唯一的文件名，打印出来的uid其实就是时间戳
      const result = await client().put(fileName, content)
      this.form.img = result.url
      this.img = result.url
      console.log(this.form.img)
      this.$message.success('上传成功')
    },
    async Upload(file) {
      console.log(file)
      const fs = require('fs')
      const content = fs.readFileSync(file.file.path)
      var fileName = 'goods' + file.file.uid + '.' + file.file.type.split('/')[1]
      // 定义唯一的文件名，打印出来的uid其实就是时间戳
      const result = await client().put(fileName, content)
      console.log(1)
      await updateGoodsImg(this.row.goods_no, result.url)
      await this.select()
      this.row.img = result.url
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
    async deleteRow(row) {
      await deleteMyGoods(row.goods_no)
      await this.select()
      this.$message.success('删除成功')
    },
    async select() {
      Object.keys(this.headerform)
        .filter(key => this.headerform[key] === '')
        .forEach(key => delete this.headerform[key])
      console.log(this.headerform)
      this.data = await getMyGoods(this.token, this.headerform)
    },
    async edit() {
      Object.keys(this.form)
        .filter(key => this.form[key] === this.row[key])
        .forEach(key => delete this.form[key])
      if (Object.keys(this.form).length !== 0) {
        await updateMyGoods(this.form, this.row.goods_no)
        await this.select()
        this.$message.success('更新成功')
      }
      this.editFormVisible = false
    },
    async insert() {
      await addMyGoods(this.token, this.form)
      this.insertFormVisible = false
      await this.select()
      this.$message.success('插入成功')
    }
  },
  async mounted() {
    await this.select()
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    
  }
</style>
