<template>
  <div class="app-container">
    <el-form :model="headerform" :inline="true" style="text-align:center">
      <el-form-item>
       <el-select v-model="state">
         <el-option 
         v-for="item in stateList"
         :key=item
         :label="item"
         :value="item"
         >

         </el-option>
       </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="select">查询</el-button>
      </el-form-item>
    </el-form>
   <el-row>
  <el-col :span="20" v-for="(item,index) in orders" :key="index" :offset="1">
    <slot></slot>
    <el-card :body-style="{ padding: '0px' }">
      <el-container>
          <el-aside width='200px'>
 <img :src="item.img" class="image"  style="width:200px" @click="onClick(item)">
      </el-aside>
      <el-main style="text-align:center;font-size:20px">
        <div style="margin-top: 10px;">{{item.name}}</div>
        <div style="margin-top: 10px;">
          
          
        <span style="color:#fe4404;margin-top: 10px;">价格：{{item.price.toFixed(2)}}&nbsp;&nbsp;&nbsp;</span>
        <span>数量:{{item.num}}</span>
        </div>
         <div style="margin-top: 10px;">
           <span>下单时间:{{parseTime(item.time)}}</span>
        </div>
         <div style="margin-top: 10px;">
           <span>卖家:{{item.seller}}&nbsp;&nbsp;&nbsp;</span>
           <span>状态:{{item.state}}</span>
        </div>
        <div v-if="item.state.indexOf('已发货')!=-1" style="margin-top: 10px;">
          <span>快递：{{item.express_name}},{{item.express_number}}</span>
           <el-button @click="confirmGoods(item)">确认收货</el-button>
        </div>
        <div v-if="item.state.indexOf('待发货')!=-1" style="margin-top: 10px;">
           <el-button @click="backMoney(item)">退款</el-button>
        </div>
        <div v-else-if="item.state.indexOf('退')==-1" style="margin-top: 10px;">
           <el-button @click="backGoods(item)">退货退款</el-button>
        </div>
        <!-- <div style="margin-top: 10px;">
          <el-button @click="like(item)">好评</el-button>
            <span>{{item.likes}}</span>
          <el-button @click="dislike(item)">差评</el-button>
            <span>{{item.dislikes}}</span>
        </div> -->
        <div style="margin-top: 10px;">
          <el-button @click="show_comment_dialog(item)">评论</el-button>
        </div>
        </el-main>
        </el-container>
    </el-card>
  </el-col> 
</el-row>
<el-dialog title="评论" :visible.sync="commentVisible">
  <el-input
    type="textarea"
    :rows=10
    placeholder="请输入评论"
    v-model="comment"
  ></el-input>
  <div class="block">
    <span class="demonstration">区分颜色</span>
    <el-rate
      v-model="rating"
      :colors="colors">
    </el-rate>
  </div>
  <el-button @click="submit_comment">提交</el-button>
</el-dialog>
  </div>
</template>

<style>
.box{
    width:50%; margin-top:10%; margin:auto; padding:28px;
    height:350px; border:1px #111 solid;
    display:none;            /* 默认对话框隐藏 */
}
.box.show{display:block;} 
.box .x{ font-size:18px; text-align:right; display:block;}
.box input{width:80%; font-size:18px; margin-top:18px;}
</style>

<script>
import { mapGetters } from 'vuex'
import { addOrder } from '@/api/order'
import { getConsignee, addConsignee, deleteConsignee, updateConsignee } from '@/api/consignee'
import { getOrderForBuyer, updateOrder } from '@/api/order'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      consigneeForm: {},
      consigneeEditVisible: false,
      consigneeAddVisible: false,
      headerform: {},
      orders: [],
      item: { name: '', price: 0, old_price: 0 },
      buyVisible: false,
      detailVisible: false,
      formLabelWidth: '100px',
      options: [],
      consignee_no: null,
      consignee: null,
      selected: [],
      state: null,
      stateList: ['全部', '待发货', '已发货', '申请退货', '退货成功', '交易成功'],
      comment: null,
      rating: null,
      commentVisible: false,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'] // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
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
    this.orders = await getOrderForBuyer(this.token)
  },
  methods: {
    async select() {
      this.orders = await getOrderForBuyer(this.token, this.state)
    },
    async confirmGoods(item) {
      await updateOrder(item.order_no, '交易成功')
      this.orders = await getOrderForBuyer(this.token)
      this.$message.success('确认收货成功')
    },
    async backGoods(item) {
      await updateOrder(item.order_no, '申请退货中')
      this.orders = await getOrderForBuyer(this.token)
      this.$message.success('申请退货成功')
    },
    async backMoney(item) {
      await updateOrder(item.order_no, '退款成功')
      this.orders = await getOrderForBuyer(this.token)
      this.$message.success('卖家尚未发货，自动退款成功')
    },
    async AddConsignee() {
      await addConsignee(this.token, this.consigneeForm)
      this.options = await getConsignee(this.token)
      this.$message.success('添加成功')
      this.consigneeAddVisible = false
    },
    async EditConsignee() {
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
    onClick(item) {
      this.detailVisible = true
      this.item = item
    },
    async onReady() {
      this.options = await getConsignee(this.token)
      this.buyVisible = true
    },
    async onBuy() {
      await addOrder(this.token, [this.item])
      this.$message.success('模拟付款成功')
      this.buyVisible = false
      this.detailVisible = false
    },
    // async like(item) {
    // },
    // async dislike(item) {
    // },
    show_comment_dialog() {
      this.commentVisible = true
    },
    async submit_comment() {
      this.commentVisible = false
      // TODO:
      // await post_comment(this.token, this.item.goods_no, this.rating, this.comment)
    },
    parseTime(time) { return parseTime(time) }
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
