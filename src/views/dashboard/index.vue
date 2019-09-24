<template>
  <div class="dashboard-container">
    <!--<div class="dashboard-text">name:{{name}}</div>-->
    <!--<div class="dashboard-text">roles:<span v-for='role in roles' :key='role'>{{role}}</span></div>-->
    <div style="width: 100%;display: flex;justify-content: center">
      <h1 style="font-size: 30px">欢迎使用后台管理系统！</h1>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
