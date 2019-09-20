<template>
  <transition name="slide-fade">
    <div v-if="!collapse">
      <router-link v-if="!collapse" key="expand" to="/">
        <img :src="logo ? logo : require('@/assets/system/logo.png')" class="sidebar-logo">
      </router-link>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
  .slide-fade-enter-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter {
    transform: translateX(-100px);
    opacity: 0;
  }
  .sidebar-logo {
    width:160px;
    height:55px;
    margin: 10px
  }
</style>
