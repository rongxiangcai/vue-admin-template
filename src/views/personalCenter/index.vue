<template>
  <div class="persional">
    <h2>个人信息</h2>
    <div class="section1">
      <div class="avatar">
        <img v-if="userInfo.avatarUrl == '1'" alt="" :src="require('@/assets/system/default-avatar1.jpg')">
        <img v-if="userInfo.avatarUrl == '2'" alt="" :src="require('@/assets/system/default-avatar2.jpg')">
        <img v-if="userInfo.avatarUrl !== '1' && userInfo.avatarUrl !== '2' && userInfo.avatarUrl" alt="" :src="userInfo.avatarUrl">
        <img v-if="!userInfo.avatarUrl" :src="require('@/assets/system/avatar_default3.png')" alt="">
        <p><span @click="onVis1">修改头像</span></p>
      </div>
      <div class="intro">
        <p>登录账号：{{ userInfo.account }}</p>
        <p>上次登录时间：{{ datestamp2date(userInfo.previousStamp) }}</p>
        <p>上次登录IP：{{ userInfo.previousIp }}</p>
      </div>
    </div>
    <!-- section -->
    <div class="section2">
      <div class="text">
        <span>登录账号</span>
        <p>您可以修改登录账号，便于记忆。系统中账号唯一。</p>
      </div>
      <div class="setting">
        <template>
          <el-button type="primary" size="small" style="margin-left: 30px;" @click="onvis5">修改</el-button>
        </template>
      </div>
    </div>

    <!-- section -->
    <div class="section2">
      <div class="text">
        <span>登录密码</span>
        <p>安全性高的密码可以使账号更安全。建议您定期更换密码，设置一个包含字母，符号或数字中至少两项且长度超过6位的密码</p>
      </div>
      <div class="setting">
        <template>
          <el-button type="primary" size="small" style="margin-left: 30px;" @click="onVis2">修改</el-button>
        </template>
      </div>
    </div>

    <!--绑定手机号-->
    <div class="section2">
      <div class="text">
        <span>绑定手机号</span>
        <p>
          <template v-if="!userInfo.cellphone">未绑定手机号</template>
          <template v-else>您已绑定了手机<span style="color:#429BF4;font-size:inherit;margin:0;">{{ userInfo.cellphone.substr(0,3) + '****' + userInfo.cellphone.substr(7,4) }}</span>[您的手机为安全手机，可以找回密码，但不能用于登录]</template>
        </p>
      </div>
      <div class="setting">
        <template v-if="userInfo.cellphone">
          <div class="isInfo">
            <span><i class="el-icon-circle-check" style="color:#259B24;margin-right: 4px;font-size:20px;" />已绑定</span>
          </div>
          <el-button type="primary" size="small" style="margin-left: 30px;" @click="onVis4">修改</el-button>
        </template>
        <template v-if="!userInfo.cellphone">
          <div class="isInfo">
            <span><i class="el-icon-warning" style="color:#FF9800;margin-right: 4px;font-size:20px;" />未绑定</span>
          </div>
          <el-button type="primary" size="small" style="margin-left: 30px;" @click="onVis3">绑定</el-button>
        </template>
      </div>
    </div>

    <!--邮箱-->
    <!--<div class="section2">-->
    <!--<div class="text">-->
    <!--<span>绑定邮箱</span>-->
    <!--<p>-->
    <!--<template v-if="!userInfo.email">未绑定邮箱</template>-->
    <!--<template v-else>您已绑定了邮箱<span style="color:#429BF4;font-size:inherit;margin:0;">{{ userInfo.email.substr(0,2) + '****' + userInfo.email.substr(userInfo.email.lastIndexOf('@'), userInfo.email.length - 1) }}</span></template>-->
    <!--</p>-->
    <!--</div>-->
    <!--<div class="setting">-->
    <!--<template v-if="userInfo.email">-->
    <!--<div class="isInfo">-->
    <!--<span><i class="el-icon-circle-check" style="color:#259B24;margin-right: 4px;font-size:20px;"></i>已绑定</span>-->
    <!--</div>-->
    <!--<el-button type="primary" size="small" style="margin-left: 30px;">修改</el-button>-->
    <!--</template>-->
    <!--<template  v-if="!userInfo.email">-->
    <!--<div class="isInfo">-->
    <!--<span><i class="el-icon-warning" style="color:#FF9800;margin-right: 4px;font-size:20px;"></i>未绑定</span>-->
    <!--</div>-->
    <!--<el-button type="primary" size="small" style="margin-left: 30px;">绑定</el-button>-->
    <!--</template>-->
    <!--</div>-->
    <!--</div>-->

    <!-- 修改头像 -->
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible.vis1"
      width="480px"
      @close="closeDialog('vis1')"
    >
      <div v-loading="dialogLoading" class="dialog_saveAvatar">
        <form ref="vis1" :model="userInfo_avatar">
          <el-tabs v-model="userInfo_avatar.tabs" stretch @tab-click="handleClick">
            <el-tab-pane label="使用系统头像" name="one">
              <p>可使用系统头像选择一张图片作为头像</p>
              <div class="system">
                <div class="item" @click="onVis1Type('1')"><img :src="require('@/assets/system/default-avatar1.jpg')"><i v-if="userInfo_avatar.type == '1'" class="el-icon-circle-check" style="color:#259B24;margin-right: 4px;font-size:26px;" /></div>
                <div class="item" @click="onVis1Type('2')"><img :src="require('@/assets/system/default-avatar2.jpg')"><i v-if="userInfo_avatar.type == '2'" class="el-icon-circle-check" style="color:#259B24;margin-right: 4px;font-size:26px;" /></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="本地头像上传" name="two">
              <p style="text-align:center;">从电脑里挑选一张好图作为头像</p>
              <div class="upload">
                <el-upload
                  class="avatar-uploader"
                  :action="hosturl"
                  :data="pdata"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="userInfo_avatar.src" :src="userInfo_avatar.src" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </div>
              <p style="text-align:center;">支持jpg/png格式图片,文件需小于5M</p>
            </el-tab-pane>
          </el-tabs>
        </form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.vis1 = false">取 消</el-button>
        <el-button type="primary" @click="onSaveAvatar">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible.vis2"
      width="480px"
      @close="closeDialog('vis2')"
    >
      <div v-loading="dialogLoading" class="savePassword">
        <el-form ref="vis2" :model="userInfo_password" label-width="100px" :rules="ruleForm">
          <el-form-item label="当前密码：" prop="oldPwd">
            <el-input v-model="userInfo_password.oldPwd" type="password" />
          </el-form-item>
          <el-form-item label="新密码：" prop="newPwd">
            <el-input v-model="userInfo_password.newPwd" type="password" />
          </el-form-item>
          <el-form-item label="重复密码：" prop="NewPwdR">
            <el-input v-model="userInfo_password.NewPwdR" type="password" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.vis2 = false">取 消</el-button>
        <el-button type="primary" @click="onSavePassword('vis2')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 绑定手机号 -->
    <el-dialog
      title="绑定手机号"
      :visible.sync="dialogVisible.vis3"
      width="480px"
      @close="closeDialog('vis3')"
    >
      <div v-loading="dialogLoading" class="savePassword">
        <el-form ref="vis3" :model="userInfo_phone" label-width="100px" :rules="ruleForm2">
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model="userInfo_phone.phone" />
          </el-form-item>
          <div style="display:flex;">
            <el-form-item label="验证码：" prop="code">
              <el-input v-model="userInfo_phone.code" />
            </el-form-item>
            <el-button size="small" type="primary" :loading="userInfo_phone.load" :disabled="code.sends != 0 ? true : false" style="width:150px;height:32px;border-radius: 15px;margin:5px 0 0 10px;" @click="sendCode(false)">发送验证码<template v-if="code.sends != 0">({{ code.sends }}秒)</template></el-button>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.vis3 = false">取 消</el-button>
        <el-button type="primary" @click="onBindPhone('vis3')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 更改手机号 -->
    <el-dialog
      title="修改手机号"
      :visible.sync="dialogVisible.vis4"
      width="480px"
      @close="closePhone"
    >
      <div v-loading="dialogLoading" class="savePassword">
        <el-form v-if="userInfo_phone.step == 0" ref="vis4" key="1" :model="userInfo_phone" label-width="100px" :rules="ruleForm3">
          <el-form-item label="原手机号：" prop="phone">
            {{ userInfo_phone.phone.substr(0,3) + '****' + userInfo_phone.phone.substr(7,4) }}
          </el-form-item>
          <div style="display:flex;">
            <el-form-item label="验证码：" prop="code">
              <el-input v-model="userInfo_phone.code" />
            </el-form-item>
            <el-button size="small" type="primary" :loading="userInfo_phone.load" :disabled="code.sends != 0 ? true : false" style="width:150px;height:32px;border-radius: 15px;margin:5px 0 0 10px;" @click="sendCode(true)">发送验证码<template v-if="code.sends != 0">({{ code.sends }}秒)</template></el-button>
          </div>
        </el-form>
        <el-form v-else-if="userInfo_phone.step == 1" ref="vis7" key="2" :model="userInfo_phone" label-width="100px" :rules="ruleForm2">
          <el-form-item label="新手机号：" prop="phone">
            <el-input v-model="userInfo_phone.phone" />
          </el-form-item>
          <div style="display:flex;">
            <el-form-item label="验证码：" prop="code">
              <el-input v-model="userInfo_phone.code" />
            </el-form-item>
            <el-button size="small" type="primary" :loading="userInfo_phone.load" :disabled="code.sends != 0 ? true : false" style="width:150px;height:32px;border-radius: 15px;margin:5px 0 0 10px;" @click="sendCode(true)">发送验证码<template v-if="code.sends != 0">({{ code.sends }}秒)</template></el-button>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="userInfo_phone.step == 0" key="1" type="primary" @click="onSavePhone('vis4')">下一步</el-button>
        <el-button v-if="userInfo_phone.step == 1" key="2" type="primary" @click="onSavePhone('vis7')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改账号 -->
    <el-dialog
      title="修改账号"
      :visible.sync="dialogVisible.vis5"
      width="480px"
      @close="closeDialog('vis5')"
    >
      <div v-loading="dialogLoading" class="savePassword">
        <el-form ref="vis5" :model="userInfo_user" label-width="100px" :rules="ruleForm4">
          <el-form-item label="当前账号：" prop="userName">
            {{ userInfo_user.account }}
          </el-form-item>
          <el-form-item label="新账号：" prop="newUserName">
            <el-input v-model="userInfo_user.newUserName" />
          </el-form-item>
          <el-form-item v-if="userInfo.cellphone" label="手机号码：" prop="phone">
            {{ userInfo_user.phone.substr(0,3) + '****' + userInfo_user.phone.substr(7,4) }}
          </el-form-item>
          <div style="display:flex;">
            <el-form-item label="验证码：" prop="code">
              <el-input v-model="userInfo_user.code" />
            </el-form-item>
            <el-button size="small" type="primary" :loading="userInfo_user.load" :disabled="code.sends != 0 ? true : false" style="width:150px;height:32px;border-radius: 15px;margin:5px 0 0 10px;" @click="accountSendCode">发送验证码<template v-if="code.sends != 0">({{ code.sends }}秒)</template></el-button>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.vis5 = false">取 消</el-button>
        <el-button type="primary" @click="confirmAccount('vis5')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getUploadKey,
    updateAvatar,
    userPasswordUpdate,
    msgSend,
    cellphoneUpdate,
    accountUpdate,
    cellphoneValid,
    getInfo
  } from '@/api/api'

  export default {
    name: 'Persional',
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.userInfo_password.newPwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        dialogVisible: {
          vis1: false,
          vis2: false,
          vis3: false,
          vis4: false,
          vis5: false,
          vis7: false
        },
        key: '',
        hosturl: '',
        images: '',
        pdata: {},
        userInfo_avatar: { type: '', src: '', tabs: 'one' },
        userInfo: this.$store.state.user.userInfo,
        dialogLoading: false,
        userInfo_password: {
          oldPwd: '',
          newPwd: '',
          NewPwdR: ''
        },
        userInfo_phone: {
          phone: '',
          code: '',
          load: false,
          step: 0
        },
        userInfo_user: {
          account: '',
          newUserName: '',
          phone: '',
          code: '',
          load: false
        },
        ruleForm: {
          oldPwd: [
            { required: true, message: '当前密码不能为空', trigger: 'blur' }
          ],
          newPwd: [
            { required: true, message: '新密码不能为空', trigger: 'blur' }
          ],
          NewPwdR: [
            { required: true, message: '重复密码不能为空', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        ruleForm2: {
          phone: [
            { required: true, message: '当前手机号不能为空', trigger: 'blur' },
            { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '手机号码格式不正确', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        ruleForm3: {
          code: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        ruleForm4: {
          code: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ],
          newUserName: [
            { required: true, message: '新账号名不能为空', trigger: 'blur' }
          ]
        },
        code: {
          sends: 0,
          fun: null
        }
      }
    },
    mounted() {
      this.ifAvatar()
    },
    methods: {
      closeDialog(val) {
        if (val == 'vis1') {
          this.userInfo_avatar = { type: '', src: '', tabs: 'one' }
          this.userInfo_avatar.type = this.$store.state.user.userInfo.avatarUrl
        } else {
          this.$refs[val].resetFields()
          if (this.code.sends !== 0) {
            this.code.sends = 0
            clearInterval(this.code.fun)
          }
        }
      },
      getUploadPictureToken() {
        return getUploadKey().then(res => {
          const { accessKeyId, policy, signature, key } = res.data
          const pdata = { OSSAccessKeyId: accessKeyId, policy: policy, signature: signature, key: key }
          const { OSSAccessKeyId } = pdata
          this.key = key
          this.hosturl = res.data.host
          this.pdata = { OSSAccessKeyId, policy, signature, key: key + Date.parse(new Date()) }
          return true
        }).catch(() => {
          return false
        })
      },
      onVis1() {
        this.ifAvatar()
        this.dialogVisible.vis1 = true
        this.getUploadPictureToken()
      },
      onSaveAvatar() {
        if (this.userInfo_avatar.tabs == 'two') {
          if (!this.userInfo_avatar.src) {
            this.$message.error('上传头像不能为空!')
            return false
          }
        } else {
          if (this.userInfo_avatar.type == 1) {
            this.userInfo_avatar.src = '1'
          }
          if (this.userInfo_avatar.type == 2) {
            this.userInfo_avatar.src = '2'
          }
        }
        this.dialogLoading = true
        updateAvatar({
          avatarUrl: this.userInfo_avatar.src
        }).then(() => {
          this.$store.dispatch('user/getInfo')
          this.$store.state.user.userInfo.avatarUrl = this.userInfo_avatar.src
          this.userInfo = this.$store.state.user.userInfo
          this.dialogVisible.vis1 = false
          this.dialogLoading = false
        }).catch(() => {
          this.dialogLoading = false
        })
      },
      onVis1Type(e) {
        if (e == this.userInfo_avatar.type) {
          e = ''
        }
        this.userInfo_avatar.type = e
      },
      handleAvatarSuccess(res, file) {
        this.userInfo_avatar.src = this.images
        this.images = ''
      },
      beforeAvatarUpload(file) {
        this.pdata.key = this.key + Date.parse(new Date())
        this.images = this.hosturl + '/' + this.pdata.key
        const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isJPGorPNG) {
          this.$message.error('上传头像图片只能是 JPG,PNG 格式!')
          this.images = ''
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!')
          this.images = ''
        }
        return isJPGorPNG && isLt2M
      },
      onVis2() {
        this.dialogVisible.vis2 = true
      },
      onSavePassword(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogLoading = true
            userPasswordUpdate({
              oldPwd: this.userInfo_password.oldPwd,
              newPwd: this.userInfo_password.newPwd
            }).then(() => {
              this.$message.success('修改成功！')
              this.dialogVisible.vis2 = false
              this.dialogLoading = false
            }).catch(() => {
              this.dialogLoading = false
            })
          }
        })
      },
      onVis3() {
        this.dialogVisible.vis3 = true
      },
      // 发送短信
      sendCode(flag) {
        if (flag) {
          const params = {
            cellphone: this.userInfo_phone.phone,
            type: 5
          }
          if (this.userInfo_phone.step == 0) {
            this.userInfo_phone.load = true
            msgSend(params).then(() => {
              this.userInfo_phone.load = false
              this.code.sends = 119
              this.code.fun = setInterval(() => {
                if (this.code.sends > 0) {
                  this.code.sends--
                } else {
                  this.code.sends = 0
                  clearInterval(this.code.fun)
                }
              }, 1000)
            }).catch(() => {
              this.userInfo_phone.load = false
              this.$message({
                message: '发送验证码过于频繁.请稍后再试!',
                type: 'error'
              })
            })
          }
          if (this.userInfo_phone.step == 1) {
            this.$refs.vis7.validateField('phone', (res) => {
              if (res) {
                return false
              } else {
                params.type = 4
                this.userInfo_phone.load = true
                msgSend(params).then(() => {
                  this.userInfo_phone.load = false
                  this.code.sends = 119
                  this.code.fun = setInterval(() => {
                    if (this.code.sends > 0) {
                      this.code.sends--
                    } else {
                      this.code.sends = 0
                      clearInterval(this.code.fun)
                    }
                  }, 1000)
                }).catch(() => {
                  this.userInfo_phone.load = false
                  this.$message({
                    message: '发送验证码过于频繁.请稍后再试!',
                    type: 'error'
                  })
                })
              }
            })
          }
        } else {
          this.$refs.vis3.validateField('phone', (res) => {
            if (res) {
              return false
            } else {
              this.userInfo_phone.load = true
              msgSend({
                cellphone: this.userInfo_phone.phone,
                type: 5
              }).then(() => {
                this.userInfo_phone.load = false
                this.code.sends = 119
                this.code.fun = setInterval(() => {
                  if (this.code.sends > 0) {
                    this.code.sends--
                  } else {
                    this.code.sends = 0
                    clearInterval(this.code.fun)
                  }
                }, 1000)
              }).catch(() => {
                this.userInfo_phone.load = false
                this.$message({
                  message: '发送验证码过于频繁.请稍后再试!',
                  type: 'error'
                })
              })
            }
          })
        }
      },
      // 绑定手机号
      onBindPhone(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogLoading = true
            cellphoneUpdate({
              cellphone: this.userInfo_phone.phone,
              smsCode: this.userInfo_phone.code
            }).then(() => {
              this.$message.success('手机号码绑定成功！')
              this.$store.state.user.userInfo.cellphone = this.userInfo_phone.phone
              this.userInfo = this.$store.state.user.userInfo
              this.dialogVisible.vis3 = false
              this.dialogLoading = false
            }).catch(() => {
              this.dialogLoading = false
            })
          }
        })
      },
      closePhone() {
        if (this.userInfo_phone.step == 1) {
          this.$refs['vis7'].resetFields()
        } else {
          this.$refs['vis4'].resetFields()
        }
        this.userInfo_phone.step = 0
        if (this.userInfo_phone.phone) {
          this.userInfo_phone.phone = ''
        }
        if (this.userInfo_phone.code) {
          this.userInfo_phone.code = ''
        }
      },
      // 账号修改
      confirmAccount(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogLoading = true
            accountUpdate({
              account: this.userInfo_user.newUserName,
              smsCode: this.userInfo_user.code
            }).then((res) => {
              this.$message.success('账号修改成功!')
              this.$store.commit('SET_NAME', this.userInfo_user.newUserName)
              this.$store.state.user.userInfo.username = this.userInfo_user.newUserName
              this.userInfo = this.$store.state.user.userInfo
              this.dialogVisible.vis5 = false
              this.dialogLoading = false
            }).catch(() => {
              this.dialogLoading = false
            })
          } else {
            return false
          }
        })
      },
      // 账号修改发送短信
      accountSendCode() {
        this.userInfo_phone.load = true
        msgSend({
          cellphone: this.userInfo.cellphone,
          type: 4
        }).then(() => {
          this.userInfo_phone.load = false
          this.code.sends = 119
          this.code.fun = setInterval(() => {
            if (this.code.sends > 0) {
              this.code.sends--
            } else {
              this.code.sends = 0
              clearInterval(this.code.fun)
            }
          }, 1000)
        }).catch(() => {
          this.userInfo_phone.load = false
          this.$message({
            message: '发送验证码过于频繁.请稍后再试!',
            type: 'error'
          })
        })
      },
      onVis4() {
        this.dialogVisible.vis4 = true
        this.userInfo_phone.phone = this.userInfo.cellphone
      },
      onSavePhone(formName) {
        if (this.userInfo_phone.step == 0) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              cellphoneValid({ smsCode: this.userInfo_phone.code }).then(res => {
                if (res) {
                  this.userInfo_phone.phone = ''
                  this.userInfo_phone.code = ''
                  this.code.sends = 0
                  this.userInfo_phone.step = 1
                }
              }).catch(error => {
                this.$message({
                  message: error.data.msg,
                  type: 'error'
                })
              })
            }
          })
        } else if (this.userInfo_phone.step == 1) {
          this.sendMsg('vis7')
        }
      },
      sendMsg(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogLoading = true
            cellphoneUpdate({
              cellphone: this.userInfo_phone.phone,
              smsCode: this.userInfo_phone.code
            }).then((res) => {
              this.$store.state.user.userInfo.cellphone = this.userInfo_phone.phone
              this.userInfo = this.$store.state.user.userInfo
              this.$refs[formName].resetFields()
              this.dialogVisible.vis4 = false
              this.userInfo_phone.step = 0
              this.dialogLoading = false
            }).catch(() => {
              this.dialogLoading = false
              this.userInfo_phone.phone = ''
              this.userInfo_phone.code = ''
              this.code.sends = 0
            })
          }
        })
      },
      onvis5() {
        if (!this.userInfo.cellphone) {
          this.$message({
            message: '请先绑定手机号码',
            type: 'error'
          })
          return false
        }
        this.dialogVisible.vis5 = true
        this.userInfo_user.account = this.userInfo.account
        this.userInfo_user.phone = this.userInfo.cellphone
      },
      handleClick(tab, events) {

      },
      ifAvatar() {
        if (this.$store.state.user.userInfo.avatarUrl == 1 || this.$store.state.user.userInfo.avatarUrl == 2) {
          this.userInfo_avatar.tabs = 'one'
          this.userInfo_avatar.type = this.$store.state.user.userInfo.avatarUrl
        } else {
          this.userInfo_avatar.tabs = 'two'
          this.userInfo_avatar.src = this.$store.state.user.userInfo.avatarUrl
        }
      }
    }
  }
</script>

<style scoped>
  .persional {
    padding: 0 15px;
    min-width: 600px;
    color: #484848;
  }
  .persional h2 {
    line-height: 55px;
    border-bottom: 1px solid #BBBBBB;
    font-size: 18px;
    font-weight: normal;
    margin-bottom: 30px;
  }
  .persional h2::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 18px;
    background-color: #428DF0;
    vertical-align: middle;
    margin: 0 10px 0 15px;
  }
  .section1 {
    display: flex;
    padding: 0 26px 20px 26px;
    border-bottom: 1px dashed #bbb;
  }
  .section1 .avatar {
    text-align: center;
    width: auto;
    height: auto;
  }
  .section1 .avatar img {
    width: 116px;
    height: 116px;
    margin: 0;
    padding: 0;
    display: block;
    border-radius: 50%;
  }
  .section1 .avatar p {
    color: #428DF2;
    font-size: 14px;
    margin-top: 10px;
  }
  .section1 .avatar p span {
    cursor: pointer;
  }
  .section1 .intro {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 12px;
    padding-left: 40px;
  }
  .section1 .intro p {
    padding: 0;
    margin: 6px 0;
  }
  .section2 {
    padding: 30px 40px 30px 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px dashed #bbb;
  }
  .section2 .text {
    flex: 1;
    display: flex;
    line-height: 25px;
  }
  .section2 .text span {
    font-size: 16px;
    width: 150px;
  }
  .section2 .text p {
    font-size: 14px;
    padding: 0;
    margin: 0;
    flex: 1;
  }
  .section2 .setting {
    width: 180px;
    line-height: 32px;
    display: flex;
    justify-content: flex-end;
  }
  .section2 .setting .isInfo {
    font-size: 14px;
  }
  .dialog_saveAvatar .system {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .dialog_saveAvatar .system .item {
    position: relative;
    margin: 20px;
  }
  .dialog_saveAvatar .system .item img {
    display: block;
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .dialog_saveAvatar .system .item i {
    position: absolute;
    right: 0;
    top: 10px;
    background-color: #fff;
    border-radius: 50%;
  }
  .dialog_saveAvatar p {
    font-size: 12px;
  }
  .dialog_saveAvatar .upload .avatar-uploader {
    text-align: center;
  }
  .dialog_saveAvatar .upload .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .dialog_saveAvatar .upload .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .dialog_saveAvatar .upload .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .dialog_saveAvatar .upload .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .savePassword {
    padding: 0 40px 0 10px;
  }
</style>
