<template>
  <div>
    <div style="margin-top: 50px;margin-left: 50px">
      <div>
        <span style="margin-right: 15px">允许:</span>
        <el-switch
          v-model="state"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="stateChange"
        />
      </div>
      <div style="margin-top: 30px">
        <span style="margin-right: 15px">比例:</span>
        <el-input v-model="ratio" size="small" style="width: 80px" type="number" />
        <span style="margin-right: 15px">%</span>
        <el-button type="primary" size="small" plain @click="onSubmit">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { crfState, crfRefund, baseGet, baseUpdate } from '@/api/api'
export default {
  data() {
    return {
      state: '',
      ratio: ''
    }
  },
  mounted() {
    this.loadCrfState()
    this.loadBaseGet()
  },
  methods: {
    onSubmit() {
      if (!this.ratio) {
        this.$message({ type: 'error', message: '请输入比例!' })
        return
      }
      if (this.ratio < 1 || this.ratio > 100) {
        this.$message({ type: 'error', message: '比例必须大于0，小于101!' })
        return
      }
      baseUpdate({ ratio: this.ratio }).then(res => {
        this.$message({ type: 'success', message: '操作成功' })
      })
    },
    loadCrfState() {
      crfState().then(res => {
        this.state = res.data.state
      })
    },
    stateChange(value) {
      crfRefund({ state: value }).then(res => {
        this.$message({ type: 'success', message: '操作成功' })
      })
    },
    loadBaseGet() {
      baseGet().then(res => {
        this.ratio = res.data.ratio
      })
    }
  }
}
</script>

<style scoped>

</style>
