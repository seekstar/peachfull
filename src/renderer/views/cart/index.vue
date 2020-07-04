<template>
  <div class="app-container">
    <el-form :model="headerform" :inline="true" style="text-align:center">
      <el-form-item>
        <el-checkbox  label="全选" border @change="allSelect"></el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="allBuy">购买</el-button>
      </el-form-item>
    </el-form>
   <el-row>
  <el-col :span="20" v-for="(item,index) in goods" :key="index" :offset="1">
    <slot></slot>
    <el-card :body-style="{ padding: '0px' }">
      <el-container>
          <el-aside width='200px'>
 <img :src="item.img" class="image"  style="width:200px" @click="onClick(item)">
      </el-aside>
      <el-main style="text-align:center;font-size:20px">
        <div style="margin-top: 10px;">{{item.name}}</div>
        <div style="margin-top: 10px;">
          <span style="color:#999;margin-top: 10px;">原价：{{item.old_price.toFixed(2)}}&nbsp;&nbsp;&nbsp; </span>
          
        <span style="color:#fe4404;margin-top: 10px;">价格：{{item.price.toFixed(2)}}&nbsp;&nbsp;&nbsp;</span>
        <el-checkbox  label="购买" border v-model="checked[index]"></el-checkbox>
        </div>
        <div style="margin-top: 10px;">
           <span>数量</span>
          <el-input-number size='small' v-model="item.num" @change="onChange(item.goods_no,item.num)" :min="1" :max="item.stock" label="描述文字"></el-input-number>
        <span>&nbsp;&nbsp;&nbsp;库存：{{item.stock}}&nbsp;&nbsp;&nbsp;</span>
         <el-button @click="DeleteCart(item)">移出</el-button>
        </div>
 
        
        </el-main>
        </el-container>
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
        <div>库存：{{item.stock}}</div>
        <div style="margin-top: 10px;">
          <el-button @click="onReady" :disabled="item.num===0">立即购买</el-button>
        <el-button @click="onAdd" :disabled="item.num===0">加入购物车</el-button>
        </div>
        </el-main>
        </el-container>
      <div style="font-size:20px">{{item.info}}</div>
      
    </el-dialog>
    
    <el-dialog title="批量购买" :visible.sync="allBuyVisible">
      <el-card>
        <el-select v-model="consignee_no" @change="consignee=options.filter(value=>value.consignee_no===consignee_no)[0]" placeholder="请选择收货人" style="width:65%">
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
    <el-card v-for="(item,index) in selected" :key="index">
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
      <span>总价：{{total.toFixed(2)}}</span>
          <el-button @click="onAllBuy" :disabled="total===0||!consignee_no">确认购买</el-button>
        </div>
    </el-dialog><el-dialog title="购买" :visible.sync="buyVisible">
      <el-card>
        <el-select v-model="consignee_no" @change="consignee=options.filter(value=>value.consignee_no===consignee_no)[0]" placeholder="请选择收货人" style="width:65%">
    <el-option
    
      v-for="item in options"
      :key="item.consignee_no "
      :label="item.name+' '+item.phone+' '+item.address"
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
      <span>总价：{{(item.price*num).toFixed(2)}}</span>
          <el-button @click="onBuy" :disabled="num===0||!consignee_no">确认购买</el-button>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addOrder } from '@/api/order'
import { getConsignee, addConsignee, deleteConsignee, updateConsignee } from '@/api/consignee'
import { addCart, getCart, updateCart, deleteCart } from '@/api/cart'
import AlipaySdk from 'alipay-sdk'
import AlipayFormData from 'alipay-sdk/lib/form'
export default {
  data() {
    return {
      consigneeForm: {},
      consigneeEditVisible: false,
      consigneeAddVisible: false,
      headerform: {},
      goods: [],
      item: { name: '', price: 0, old_price: 0 },
      buyVisible: false,
      allBuyVisible: false,
      detailVisible: false,
      formLabelWidth: '100px',
      options: [],
      checked: [],
      consignee_no: null,
      consignee: null,
      total: 0,
      num: 0,
      selected: []
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
    this.goods = await getCart(this.token)
    this.goods.forEach((item, index) => { this.checked[index] = false })
  },
  methods: {
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
      // this.$message.success('模拟付款成功')
      console.log('DEBUG: onBuy')
      console.log(this.item)
      const alipaySdk = new AlipaySdk({
        appId: '2021001170648180',
        privateKey: 'MIIEpAIBAAKCAQEA5++VlS85bpoJUp8xSOaoQIvnyMPfjdvohIf+S3P5Rt0pqiHEGXzcrZtMtCUioFUzDhFvjaLuEa8IFS4XR2P5YahDMafE5cohuofaDe1vmF5qLfBSE9ifRNnk11Bk2Fmh2Eb2FI8sb5lKv357WkDeV54W/zeqDzJKDS33lEYnYUUV0ED6FU8Cd+IxD3X3FMun/DL5PvMNzztmwfVMnxEAZTdcr8cRvR3vwfAzZF6CcI7QAiKtYeD5BY+HC/yZXtvZ8jyVEhNVKX6EmW3xQzQMOQzYBk3ei99bFwyv/pS8eFEFk0fyLpkXN0IexNamo5KlXWG4MpCHYoAMCDsrl6KlHQIDAQABAoIBAEhPGYN5RZ6Fx4JKv0LLJol5FLoy1u+TL9qhy1YawgylxueTv19y3hoB4NgI+9KgvVoVdYHi2fYJa6uuwvMu6ADaRJimhWxeqEVPNVxCOhh21wObePtW/dCpXf8CwW3yA9M5zF58hI4GbJdnB24L60XFs8W9xPcX5p5VRmqjtINOPpGg892P2uIN/8knZ/j0kA4TuMUPay7nm6oWfrjmboCH5ARkcTza/nhfRfAINfSXfCCHDI08EF45yNkrRRBiD6X7HIJQO7hmMoGRW/WrPHVQRziILxaj0wnXzSPyltcrvFRTzitVwX9DFa0n80HWVvIQ8JpZM+Tb0HF4XzxHTAECgYEA+hVp9RWkMkjgse9V/WyIvMZ5leaVld17L0JZqlC28pr9ze6NV0z5199GXBkk0Xc13nJRZ3RIYosSwM3uTu3sdDaMCpQbTL9A9bpKASWM/N2QYaJzZCjGj9WFBZA26gcLaawwCCpAVgUAHEQju1PtvEnEWdNWODgeudaK2eRIwQ0CgYEA7WxDAQIGuRsMTIR4XkniLe7pNu5qGFdapYkAwsotdPHWd/KitDUMsmfNvwuzGdwcZIf1mER99JIEAL4avfdcc92iehX3QXDU+gaVoqV7IWSMV87pavc1I7FBnUDc/DfnvsiezI8FzMK9PKLO+tM7jcHsuKR3rM8rh1pGD7AP0FECgYEAupU/eJus5dd5zUfD4FAZtL5f+HcRI78bKSdXvrp5xIfe1MYmrfvAbE8pL42S6rUGe/DOy2D2oI8ibrc2Fa1tvUb1NO9LbvdCgBN9I13g0sh78FxDu3awrp+fn4b5caHP4geVzoG3fnY8nto3zovP06s1087ZhRhZ1E09S1QG9AECgYAHOUYIn9EojKQhJ96pr8HL9/rsivB7cRz28GYvhws/BaSq3Z0JspuCSho+d9KpNMNAY8qbKWpTqKWqiB40LXSIqfOpl0WAnjg8qzqeSj6m03JZsZf0gzUAswH2EOUoX2MTsPLz8l4QztQHJkT56LdlJsNXEtn5Tgxa/+olzAuPIQKBgQDNYpLP5a/u5ffwceBRre2kISXMvf3qyLZK87rgim4HzjhWD+BRw//XCT4G6tdho4Wbb0ZxsSIZfNZHr8WPzyZFgluyhtEssmz0050teZXtn8crDScKH/uTpN+Ir/UVrRv3VRGTobERo+UhFYT6s5TLt+IL1LSXcE0VXimuxUxjyQ=='
      })
      const formData = new AlipayFormData()
      formData.addField('notifyUrl', 'http://www.com/notify') // TODO
      formData.addField('bizContent', {
        outTradeNo: '123456', // TODO
        productCode: 'FAST_INSTANT_TRADE_PAY',
        totalAmount: this.item.price * 1, // TODO
        subject: '商品', // TODO
        body: '商品详情' // TODO
      })
      const result = await alipaySdk.exec('alipay.trade.page.pay', {}, { formData: formData })
      console.log(result)
      this.buyVisible = false
      this.detailVisible = false
    },
    async onAdd() {
      await addCart(this.token, this.item.goods_no, this.item.num)
      this.$message.success('添加成功')
      this.detailVisible = false
    },
    async onChange(goods_no, num) {
      await updateCart(goods_no, num)
    },
    allSelect(value) {
      this.checked = this.checked.map(() => value)
    },
    async DeleteCart(item) {
      await deleteCart(item.cart_no)
      this.goods = await getCart(this.token)
      this.goods.forEach((item, index) => { this.checked[index] = false })
      this.$message.success('删除成功')
    },
    async allBuy() {
      this.total = 0
      this.selected = this.goods.filter((value, index) => this.checked[index])
      this.selected.forEach(value => {
        this.total += value.price * value.num
      })
      this.options = await getConsignee(this.token)
      this.allBuyVisible = true
    },
    async onAllBuy() {
      await addOrder(this.token, this.selected, this.consignee)
      console.log(this.selected)
      await this.selected.forEach(async value => { await deleteCart(value.cart_no) })
      this.goods = await getCart(this.token)
      this.goods.forEach((item, index) => { this.checked[index] = false })
      this.$message.success('购买成功')
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
