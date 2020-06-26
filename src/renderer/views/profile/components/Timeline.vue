<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.time" placement="top">
        <el-card>
          <h4>{{ item.ip }}</h4>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getLog } from '@/api/user'
import { parseTime } from '@/utils/index'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: '',
          name: '',
          phone: '',
          avatar: '',
          role: ''
        }
      }
    }
  },
  async mounted() {
    this.timeline = await getLog(this.user.username)
    this.timeline.forEach(value => { value['time'] = parseTime(value['time']) })
  },
  data() {
    return {
      timeline: []
    }
  }
}
</script>
