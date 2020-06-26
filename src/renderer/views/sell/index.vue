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
    <el-table :data="orders" stripe height="500" >
       <el-table-column prop="order_no" label="订单号" sortable width="100" align="center"></el-table-column>
      <el-table-column prop="goods_no" label="商品号" sortable width="100" align="center"></el-table-column>
      <el-table-column prop="name" label="商品名" sortable width="100" align="center"></el-table-column>
      <el-table-column prop="price" label="价格" sortable width="100" align="center"></el-table-column>
      <el-table-column prop="num" label="数量" sortable width="100" align="center"></el-table-column>
      <el-table-column prop="time" label="下单时间" sortable width="100" align="center"></el-table-column>
      <el-table-column prop="state" label="状态" sortable width="100" align="center"></el-table-column>
      <el-table-column prop="express_name" label="快递公司" sortable width="100" align="center"></el-table-column>
      <el-table-column prop="express_number" label="快递单号" sortable width="100" align="center"></el-table-column>
       <el-table-column prop="consignee_name" label="收货人" width="100" align="center"></el-table-column>
       <el-table-column prop="consignee_phone" label="电话" width="100" align="center"></el-table-column>
       <el-table-column prop="consignee_address" label="地址" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
      
    
        <div v-if="scope.row.state.indexOf('待发货')!=-1" style="margin-top: 10px;">
          
           <el-button @click="selectGoods={...scope.row};deliverVisible=true">发货</el-button>
        </div>
        <div v-else-if="scope.row.state.indexOf('申请退货')!=-1" style="margin-top: 10px;">
           <el-button @click="resolveBack(scope.row)">同意</el-button>
           <el-button @click="rejectBack(scope.row)">拒绝</el-button>
        </div>
        </template>
      </el-table-column>
    </el-table>

<el-dialog :visible.sync="deliverVisible">
      <el-form v-model="deliverForm">
        <el-form-item label="快递公司" :label-width="formLabelWidth">
          <el-input v-model="deliverForm.express_name"></el-input>
        </el-form-item>
        <el-form-item label="快递单号" :label-width="formLabelWidth">
          <el-input v-model="deliverForm.express_no"></el-input>
        </el-form-item>
        
      </el-form>
       <div slot="footer" class="dialog-footer">
        <el-button @click="deliverVisible = false">取 消</el-button>
        <el-button type="primary" @click="deliver(item)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOrderForSeller, updateOrder, addExpress } from '@/api/order'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      headerform: {},
      orders: [],
      selectGoods: {},
      deliverVisible: false,
      deliverForm: {},
      formLabelWidth: '100px',
      stateList: ['全部', '待发货', '已发货', '申请退货', '退货成功', '交易成功'],
      state: null,
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
    this.select()
  },
  methods: {
    async select() {
      this.orders = await getOrderForSeller(this.token, this.state)
      this.orders.forEach(value => { value['time'] = parseTime(value['time']) })
    },
    async deliver() {
      await addExpress(this.selectGoods.order_no, this.deliverForm.express_name, this.deliverForm.express_no)
      this.deliverVisible = false
      this.select()
      this.$message.success('发货成功')
    },
    async resolveBack(item) {
      await updateOrder(item.order_no, '退货成功')
      this.orders = await getOrderForSeller(this.token)
      this.$message.success('退货成功')
    },
    async rejectBack(item) {
      await updateOrder(item.order_no, '已发货')
      this.orders = await getOrderForSeller(this.token)
      this.$message.success('拒绝成功')
    },
    parseTime(time) { return parseTime(time) },
    onClick(item) {
      console.log(1)
      this.detailVisible = true
      this.item = item
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
