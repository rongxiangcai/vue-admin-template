<template>
  <div class="login-container">
    <h1 class="title">欢迎使用后台管理系统</h1>
    <el-card class="box-card">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px">
        <el-form-item prop="account">
          <el-input v-model="loginForm.account" name="account" type="text" auto-complete="on" placeholder="账号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            name="password"
            :type="pwdType"
            auto-complete="on"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item v-if="capState" prop="gtCapValid">
          <div id="captcha" style="display: flex;justify-content: center">
            <p id="wait" class="show">正在加载验证码......</p>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import './gt'
import { firstVerify } from '@/api/api'
import Cookies from 'js-cookie'
import { openFirstVerify } from '@/config/config'
const Cookie_Username = 'username'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    // const loginFormWidth = window.screen.width > 375 ? '400px' : '370px'
    return {
      loginForm: {
        account: '',
        password: '',
        gtCapValid: '',
        geetestChallenge: '',
        geetestValidate: '',
        geetestSeccode: '',
        gtServerStatus: ''
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        gtCapValid: [
          { required: openFirstVerify, message: '请先验证滑块', trigger: 'blur' }
        ]
      },
      loading: false,
      pwdType: 'password',
      gtServerStatus: '',
      capState: true
    }
  },
  created() {
    this.initGtCaptcha()
  },
  mounted() {
    const username = Cookies.get(Cookie_Username)
    username ? this.loginForm.account = username : null
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      Cookies.set(Cookie_Username, this.loginForm.account)
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch((error) => {
            console.log(error)
            this.loading = false
            this.capState = false
            setTimeout(() => {
              this.capState = true
              this.initGtCaptcha()
            }, 100)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    initGtCaptcha() {
      var _this = this
      firstVerify().then(function(res) {
        _this.gtServerStatus = res.data.gtServerStatus
        window.initGeetest({
          // 以下 4 个配置参数为必须，不能缺少
          gt: res.data.gt,
          challenge: res.data.challenge,
          offline: !res.data.success, // 表示用户后台检测极验服务器是否宕机
          new_captcha: res.data.newCaptcha, // 用于宕机时表示是新验证码的宕机

          product: 'float', // 产品形式，包括：float，popup
          width: '400px'
        }, function(captchaObj) {
          captchaObj.appendTo('#captcha')
          captchaObj.onReady(function() {
            document.getElementById('wait').style.display = 'none'
          })
          captchaObj.onSuccess(function() {
            _this.loginForm.gtCapValid = captchaObj.getValidate()
            console.log('gtCapValid', _this.loginForm.gtCapValid)
            _this.loginForm.geetestChallenge = _this.loginForm.gtCapValid.geetest_challenge
            _this.loginForm.geetestValidate = _this.loginForm.gtCapValid.geetest_validate
            _this.loginForm.geetestSeccode = _this.loginForm.gtCapValid.geetest_seccode
            _this.loginForm.gtServerStatus = _this.gtServerStatus
          })
          captchaObj.onError(function() {
            // 出错啦，可以提醒用户稍后进行重试
            _this.$notify.error({
              title: '错误',
              message: '出错啦，请稍后进行重试'
            })
          })
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss">
  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url("https://stwaly.oss-cn-shanghai.aliyuncs.com/static/bg_login.png");
    height: 100vh;
    h1 {
      color: white;
      margin-bottom: 50px;
    }
    .box-card {
      background-color: white;
      width: 480px;
    }
    .el-form-item {
      width: 400px;
      margin: 50px auto 0px auto;
    }
    .el-input {
      width: 400px;
      margin: 0 auto;
      display: block;
      input {
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid #e8e7ea;
        padding: 0;
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        box-shadow:0 0 0 60px white inset;
        -webkit-text-fill-color: #878787;
      }
    }
    .el-form-item {
      border: none;
      background: transparent;
    }
    .el-button {
      margin-bottom: 30px;
      height: 50px;
    }
  }
</style>
