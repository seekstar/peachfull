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
    <el-dialog title='请在弹出的网页支付' :visible.sync='checkPayVisible'>
      <table>
        <el-button @click='checkPay'>我已完成付款</el-button>
        <span>{{checkRes}}</span>
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
import AlipaySdk from 'alipay-sdk'
import AlipayFormData from 'alipay-sdk/lib/form'
const { shell } = require('electron')
const request = require('request')
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
      commentsVisible: false,
      checkPayVisible: false,
      lastOutTradeNo: null,
      checkRes: ''
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
      const alipaySdk = new AlipaySdk({
        // appId: '2021001170648180',
        appId: '2016102900776137',
        gateway: 'https://openapi.alipaydev.com/gateway.do',
        privateKey: 'MIIEpAIBAAKCAQEA5++VlS85bpoJUp8xSOaoQIvnyMPfjdvohIf+S3P5Rt0pqiHEGXzcrZtMtCUioFUzDhFvjaLuEa8IFS4XR2P5YahDMafE5cohuofaDe1vmF5qLfBSE9ifRNnk11Bk2Fmh2Eb2FI8sb5lKv357WkDeV54W/zeqDzJKDS33lEYnYUUV0ED6FU8Cd+IxD3X3FMun/DL5PvMNzztmwfVMnxEAZTdcr8cRvR3vwfAzZF6CcI7QAiKtYeD5BY+HC/yZXtvZ8jyVEhNVKX6EmW3xQzQMOQzYBk3ei99bFwyv/pS8eFEFk0fyLpkXN0IexNamo5KlXWG4MpCHYoAMCDsrl6KlHQIDAQABAoIBAEhPGYN5RZ6Fx4JKv0LLJol5FLoy1u+TL9qhy1YawgylxueTv19y3hoB4NgI+9KgvVoVdYHi2fYJa6uuwvMu6ADaRJimhWxeqEVPNVxCOhh21wObePtW/dCpXf8CwW3yA9M5zF58hI4GbJdnB24L60XFs8W9xPcX5p5VRmqjtINOPpGg892P2uIN/8knZ/j0kA4TuMUPay7nm6oWfrjmboCH5ARkcTza/nhfRfAINfSXfCCHDI08EF45yNkrRRBiD6X7HIJQO7hmMoGRW/WrPHVQRziILxaj0wnXzSPyltcrvFRTzitVwX9DFa0n80HWVvIQ8JpZM+Tb0HF4XzxHTAECgYEA+hVp9RWkMkjgse9V/WyIvMZ5leaVld17L0JZqlC28pr9ze6NV0z5199GXBkk0Xc13nJRZ3RIYosSwM3uTu3sdDaMCpQbTL9A9bpKASWM/N2QYaJzZCjGj9WFBZA26gcLaawwCCpAVgUAHEQju1PtvEnEWdNWODgeudaK2eRIwQ0CgYEA7WxDAQIGuRsMTIR4XkniLe7pNu5qGFdapYkAwsotdPHWd/KitDUMsmfNvwuzGdwcZIf1mER99JIEAL4avfdcc92iehX3QXDU+gaVoqV7IWSMV87pavc1I7FBnUDc/DfnvsiezI8FzMK9PKLO+tM7jcHsuKR3rM8rh1pGD7AP0FECgYEAupU/eJus5dd5zUfD4FAZtL5f+HcRI78bKSdXvrp5xIfe1MYmrfvAbE8pL42S6rUGe/DOy2D2oI8ibrc2Fa1tvUb1NO9LbvdCgBN9I13g0sh78FxDu3awrp+fn4b5caHP4geVzoG3fnY8nto3zovP06s1087ZhRhZ1E09S1QG9AECgYAHOUYIn9EojKQhJ96pr8HL9/rsivB7cRz28GYvhws/BaSq3Z0JspuCSho+d9KpNMNAY8qbKWpTqKWqiB40LXSIqfOpl0WAnjg8qzqeSj6m03JZsZf0gzUAswH2EOUoX2MTsPLz8l4QztQHJkT56LdlJsNXEtn5Tgxa/+olzAuPIQKBgQDNYpLP5a/u5ffwceBRre2kISXMvf3qyLZK87rgim4HzjhWD+BRw//XCT4G6tdho4Wbb0ZxsSIZfNZHr8WPzyZFgluyhtEssmz0050teZXtn8crDScKH/uTpN+Ir/UVrRv3VRGTobERo+UhFYT6s5TLt+IL1LSXcE0VXimuxUxjyQ=='
      })
      this.lastOutTradeNo = 'peachfull_' + (new Date()).valueOf()
      console.log(this.lastOutTradeNo)
      const formData = new AlipayFormData()
      formData.setMethod('get')
      formData.addField('notifyUrl', 'http://www.com/notify') // TODO
      formData.addField('bizContent', {
        outTradeNo: this.lastOutTradeNo,
        productCode: 'FAST_INSTANT_TRADE_PAY',
        totalAmount: this.item.price * this.item.num,
        subject: this.item.name,
        body: this.item.info
      })
      const result = await alipaySdk.exec('alipay.trade.page.pay', {}, { formData: formData })
      console.log(result)
      shell.openExternal(result)
      this.buyVisible = false
      this.detailVisible = false
      this.checkPayVisible = true
    },
    async checkPay() {
      this.checkRes = '正在查询支付状态'
      const alipaySdk = new AlipaySdk({
        // appId: '2021001170648180',
        appId: '2016102900776137',
        gateway: 'https://openapi.alipaydev.com/gateway.do',
        privateKey: 'MIIEpAIBAAKCAQEA5++VlS85bpoJUp8xSOaoQIvnyMPfjdvohIf+S3P5Rt0pqiHEGXzcrZtMtCUioFUzDhFvjaLuEa8IFS4XR2P5YahDMafE5cohuofaDe1vmF5qLfBSE9ifRNnk11Bk2Fmh2Eb2FI8sb5lKv357WkDeV54W/zeqDzJKDS33lEYnYUUV0ED6FU8Cd+IxD3X3FMun/DL5PvMNzztmwfVMnxEAZTdcr8cRvR3vwfAzZF6CcI7QAiKtYeD5BY+HC/yZXtvZ8jyVEhNVKX6EmW3xQzQMOQzYBk3ei99bFwyv/pS8eFEFk0fyLpkXN0IexNamo5KlXWG4MpCHYoAMCDsrl6KlHQIDAQABAoIBAEhPGYN5RZ6Fx4JKv0LLJol5FLoy1u+TL9qhy1YawgylxueTv19y3hoB4NgI+9KgvVoVdYHi2fYJa6uuwvMu6ADaRJimhWxeqEVPNVxCOhh21wObePtW/dCpXf8CwW3yA9M5zF58hI4GbJdnB24L60XFs8W9xPcX5p5VRmqjtINOPpGg892P2uIN/8knZ/j0kA4TuMUPay7nm6oWfrjmboCH5ARkcTza/nhfRfAINfSXfCCHDI08EF45yNkrRRBiD6X7HIJQO7hmMoGRW/WrPHVQRziILxaj0wnXzSPyltcrvFRTzitVwX9DFa0n80HWVvIQ8JpZM+Tb0HF4XzxHTAECgYEA+hVp9RWkMkjgse9V/WyIvMZ5leaVld17L0JZqlC28pr9ze6NV0z5199GXBkk0Xc13nJRZ3RIYosSwM3uTu3sdDaMCpQbTL9A9bpKASWM/N2QYaJzZCjGj9WFBZA26gcLaawwCCpAVgUAHEQju1PtvEnEWdNWODgeudaK2eRIwQ0CgYEA7WxDAQIGuRsMTIR4XkniLe7pNu5qGFdapYkAwsotdPHWd/KitDUMsmfNvwuzGdwcZIf1mER99JIEAL4avfdcc92iehX3QXDU+gaVoqV7IWSMV87pavc1I7FBnUDc/DfnvsiezI8FzMK9PKLO+tM7jcHsuKR3rM8rh1pGD7AP0FECgYEAupU/eJus5dd5zUfD4FAZtL5f+HcRI78bKSdXvrp5xIfe1MYmrfvAbE8pL42S6rUGe/DOy2D2oI8ibrc2Fa1tvUb1NO9LbvdCgBN9I13g0sh78FxDu3awrp+fn4b5caHP4geVzoG3fnY8nto3zovP06s1087ZhRhZ1E09S1QG9AECgYAHOUYIn9EojKQhJ96pr8HL9/rsivB7cRz28GYvhws/BaSq3Z0JspuCSho+d9KpNMNAY8qbKWpTqKWqiB40LXSIqfOpl0WAnjg8qzqeSj6m03JZsZf0gzUAswH2EOUoX2MTsPLz8l4QztQHJkT56LdlJsNXEtn5Tgxa/+olzAuPIQKBgQDNYpLP5a/u5ffwceBRre2kISXMvf3qyLZK87rgim4HzjhWD+BRw//XCT4G6tdho4Wbb0ZxsSIZfNZHr8WPzyZFgluyhtEssmz0050teZXtn8crDScKH/uTpN+Ir/UVrRv3VRGTobERo+UhFYT6s5TLt+IL1LSXcE0VXimuxUxjyQ=='
      })
      const formData = new AlipayFormData()
      formData.setMethod('get')
      formData.addField('bizContent', {
        outTradeNo: this.lastOutTradeNo,
        trade_no: null
      })
      const _this = this
      await alipaySdk.exec(
        'alipay.trade.query',
        {},
        { formData: formData }
      ).then(result => {
        if (result) {
          request(result, function(error, response, body) {
            if (error || response.statusCode !== 200) {
              _this.checkRes = '支付状态查询失败'
            } else {
              const obj = JSON.parse(body)
              console.log(obj)
              if (obj.alipay_trade_query_response.code === '10000') {
                _this.checkRes = '支付成功'
                _this.$message.success('支付成功')
                // TODO: Make the seller know that
                _this.checkPayVisible = false
                _this.lastOutTradeNo = null
                _this.checkRes = ''
              } else {
                _this.checkRes = obj.alipay_trade_query_response.msg + ':' + obj.alipay_trade_query_response.sub_msg
              }
            }
          })
        } else {
          _this.checkRes = '支付状态查询失败'
        }
      })
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
      // console.log(this.comments)
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
