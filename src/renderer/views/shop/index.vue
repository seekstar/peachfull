<template>
  <div class="app-container">
    <el-form :model="headerform" :inline="true" style="text-align:center">
      <el-form-item label="商品名">
        <el-input v-model="headerform.name" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item label="店铺名">
        <el-input v-model="headerform.seller" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="headerform.pricefrom" style="width:100px"></el-input>
        <span>-</span>
        <el-input v-model="headerform.priceto" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="select">查询</el-button>
      </el-form-item>
    </el-form>
   <el-row>
  <el-col :span="5" v-for="(item,index) in goods" :key="index" :offset="1">
    <slot></slot>
    <el-card :body-style="{ padding: '0px' }">
      <img :src="item.img+'?x-oss-process=image/resize,m_fixed,h_800,w_800'" class="image"  @click="onClick(item)">
      <div style="padding: 14px;">
        <span>{{item.name}}</span>
        <div class="bottom clearfix">
          <span style="color:#fe4404">{{item.price.toFixed(2)}}</span>
          <span style="text-decoration:line-through;color:#999">{{item.old_price.toFixed(2)}}</span>
          <el-button type="text" class="button" @click="headerform.seller=item.seller;select()">{{item.seller}}</el-button>
        </div>
        <span>{{item.reputation}}</span>
      </div>
    </el-card>
  </el-col> 
</el-row>
  <el-dialog title="商品详情" :visible.sync="detailVisible">
      
      <el-container>
          <el-aside width='200px'>
 <img :src="item.img" class="image"  style="width:200px" @click="onClick(item)">
      </el-aside>
      <el-main style="text-align:center;font-size:20px">
        <div>{{item.name}}</div>
        <div style="color:#999;margin-top: 10px;">原价：{{item.old_price.toFixed(2)}}</div>
        <div style="color:#fe4404;margin-top: 10px;">价格：{{item.price.toFixed(2)}}</div>
        <div style="margin-top: 10px;">
           <span>数量</span>
          <el-input-number v-model="item.num"  :min="0" :max="item.stock" label="描述文字"></el-input-number>
        </div>
        <div>库存：{{item.stock}}&nbsp;&nbsp;&nbsp;销量：{{item.sales}}</div>
        <div style="margin-top: 10px;">
          <el-button @click="onReady" :disabled="!item.num">立即购买</el-button>
          <el-button @click="onAdd" :disabled="!item.num">加入购物车</el-button>
          <el-button @click="show_comment">查看评论</el-button>
        </div>
        </el-main>
        </el-container>
      <div style="font-size:20px">{{item.info}}</div>
      
    </el-dialog>
    <el-dialog title="购买" :visible.sync="buyVisible">
      <el-card>
        <el-select v-model="consignee_no" @change="consignee=options.filter(value=>value.consignee_no===consignee_no)[0];" placeholder="请选择收货人" style="width:65%">
    <el-option
    
      v-for="item in options"
      :key="item.consignee_no "
      :label="item.consignee_name+' '+item.consignee_phone+' '+item.consignee_address"
      :value="item.consignee_no">
    </el-option>
  </el-select>
  <el-button  icon="el-icon-edit" :disabled="!consignee" @click="consigneeForm={...consignee};consigneeEditVisible=true" circle></el-button>
  <el-button  icon="el-icon-delete" :disabled="!consignee" @click="DeleteConsignee" circle></el-button>
  <el-button  icon="el-icon-plus" @click="consigneeForm={};consigneeAddVisible=true" circle></el-button>
      </el-card>
    <el-card>
       <el-container>
          <el-aside width='200px'>
 <img :src="item.img" class="image"  style="width:200px" @click="onClick(item)">
      </el-aside>
      <el-main style="text-align:center;font-size:20px">
        <div>{{item.name}}</div>
        <div style="color:#999;margin-top: 10px;">原价：{{item.old_price.toFixed(2)}}</div>
        <div style="color:#fe4404;margin-top: 10px;">价格：{{item.price.toFixed(2)}}</div>
        <div style="margin-top: 10px;">
           <span>数量</span>
          <el-input-number v-model="item.num"  :min="0" :max="item.stock" label="描述文字"></el-input-number>
        </div>
        <div>库存：{{item.stock}}</div>
        
        </el-main>
        </el-container>
    </el-card>
    <div  slot="footer" class="dialog-footer">
      <span>总价：{{(item.price*item.num).toFixed(2)}}</span>
          <el-button @click="onBuy" :disabled="!item.num||!consignee">确认购买</el-button>
        </div>
    </el-dialog>
    <el-dialog :visible.sync="consigneeAddVisible">
      <el-form v-model="consigneeForm">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="consigneeForm.consignee_name"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="consigneeForm.consignee_phone"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="consigneeForm.consignee_address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="consigneeAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddConsignee">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="consigneeEditVisible">
      <el-form v-model="consigneeForm">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="consigneeForm.consignee_name"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="consigneeForm.consignee_phone"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="consigneeForm.consignee_address"></el-input>
        </el-form-item>
        
      </el-form>
       <div slot="footer" class="dialog-footer">
        <el-button @click="consigneeEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditConsignee">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="commentsVisible">
      <table>
        <el-col v-for="comment of comments" :key="comment">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{comment.buyer}}</span>
              <span>{{(new Date(comment.time)).toISOString().slice(0,10)}}</span>
              <el-rate
                v-model="comment.rating"
                :colors="colors"
                disabled="">
              </el-rate>
            </div>
            <div>{{comment.comment}}</div>
          </el-card>
        </el-col>
      </table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGoods } from '@/api/goods'
import { addOrder } from '@/api/order'
import { getConsignee, addConsignee, deleteConsignee, updateConsignee } from '@/api/consignee'
import { getComment } from '@/api/comment'
import { addCart } from '@/api/cart'
export default {
  data() {
    return {
      headerform: { seller: '' },
      goods: [],
      item: { name: '', price: 0, old_price: 0 },
      buyVisible: false,
      detailVisible: false,
      formLabelWidth: '100px',
      options: [],
      consignee: {},
      consignee_no: null,
      consigneeForm: {},
      consigneeAddVisible: false,
      consigneeEditVisible: false,
      comments: null,
      commentsVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'name',
      'roles'
    ])
  },
  async mounted() {
    await this.select()
  },
  methods: {
    async select() {
      this.goods = await getGoods(this.headerform)
    },
    onClick(item) {
      this.detailVisible = true
      this.item = item
    },
    async onReady() {
      this.options = await getConsignee(this.token)
      this.buyVisible = true
    },
    async onBuy() {
      await addOrder(this.token, [this.item], this.consignee)
      this.$message.success('购买成功')
      this.buyVisible = false
      this.detailVisible = false
    },
    async onAdd() {
      await addCart(this.token, this.item.goods_no, this.item.num)
      this.$message.success('添加成功')
      this.detailVisible = false
    },
    async AddConsignee() {
      await addConsignee(this.token, this.consigneeForm)
      this.options = await getConsignee(this.token)
      this.$message.success('添加成功')
      this.consigneeAddVisible = false
    },
    async EditConsignee() {
      console.log(this.consignee)
      Object.keys(this.consigneeForm)
        .filter(key => this.consigneeForm[key] === this.consignee[key])
        .forEach(key => delete this.consigneeForm[key])
      if (Object.keys(this.consigneeForm).length !== 0) {
        await updateConsignee(this.consigneeForm, this.consignee_no)
        this.options = await getConsignee(this.token)
        this.$message.success('修改成功')
        this.consigneeEditVisible = false
      }
    },
    async DeleteConsignee() {
      await deleteConsignee(this.consignee['consignee_no'])
      this.options = await getConsignee(this.token)
      this.consignee_no = null
      this.$message.success('删除成功')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    async show_comment() {
      // this.comments = '正在加载'
      this.commentsVisible = true
      this.comments = await getComment(this.item.goods_no)
      console.log(this.comments)
      // this.comments = ''
      // for (var comment of commentArray) {
      //   var d = new Date(comment.time)
      //   this.comments += comment.buyer + '在' + d.getFullYear() + '年' + d.getMonth() + '月' + d.getDay() + '日' +
      //     '给了' + comment.rating + '颗星：\n' + comment.comment + '\n\n'
      //   console.log(comment)
      // }
    }
  }
}
</script>

<style>
.el-row {
    margin-top: 20px;
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
