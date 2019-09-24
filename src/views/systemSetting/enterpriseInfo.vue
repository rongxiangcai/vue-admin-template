<template>
  <div style="padding: 20px">
    <el-table class="table" :data="tableData" border>
      <el-table-column label="企业账号" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="座机" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="传真" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.fax }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="企业logo"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center">
            <div :style="getImageStyle(scope.row.logo)" />
            <el-button size="small" style="margin-left: 10px" @click="updateLogo(scope.$index, scope.row)">修改</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180" label="操作">
        <template slot-scope="scope">
          <div style="display: flex;justify-content: center">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改企业信息" :visible.sync="dialogTableVisible" :modal-append-to-body="false" width="70%" @close="closeDialog">
      <el-form ref="addForm" v-loading="loading" :model="addFormData" :rules="rules" label-width="100px">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="addFormData.name" style="margin: 0px" />
        </el-form-item>
        <el-form-item label="座机" prop="">
          <el-input v-model="addFormData.telephone" style="margin: 0px" />
        </el-form-item>
        <el-form-item label="传真" prop="">
          <el-input v-model="addFormData.fax" style="margin: 0px" />
        </el-form-item>
        <el-form-item label="描述" prop="">
          <el-input v-model="addFormData.description" style="margin: 0px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改企业logo" :visible.sync="dialogLogo" :modal-append-to-body="false" width="70%" @close="closeDialogLogo">
      <el-form ref="logoDialog" v-loading="loading" :model="logoData" :rules="rules" label-width="100px">
        <el-form-item label="logo" prop="cover">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="hosturl"
            :data="pdata"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmitLogo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tenantInfo, tenantInfoUpdate, tenantLogoUpdate, getUploadKey } from '@/api/api'
export default {
  data() {
    return {
      tableData: [],
      dialogTableVisible: false,
      addFormData: {
        account: '',
        name: '',
        telephone: '',
        fax: '',
        description: ''
      },
      logoData: {
        logo: ''
      },
      dialogLogo: false,
      rules: {
        name: [
          { required: true, message: '企业名称不能为空', trigger: 'blur' }
        ]
      },
      loading: false,
      imageUrl: '',
      pdata: {},
      hosturl: ''
    }
  },
  mounted() {
    this.loadData()
    this.getUploadPictureToken()
  },
  methods: {
    loadData() {
      this.loading = true
      tenantInfo().then(res => {
        this.loading = false
        const arr = []
        arr.push(res.data)
        this.tableData = arr
        this.$store.dispatch('app/updateLogo', res.data.logo)
      }).catch(() => {
        this.loading = false
      })
    },
    getImageStyle(url) {
      const imageUrl = url + '?x-oss-process=image/resize,m_fill,h_80,w_80'
      return {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(' + imageUrl + ')',
        width: '50px',
        height: '50px'
      }
    },
    handleEdit(index, row) {
      this.isEdit = true
      this.dialogTableVisible = true
      const newItem = { ...row }
      this.addFormData.id = newItem.id
    },
    updateLogo(index, row) {
      this.dialogLogo = true
      const newItem = { ...row }
      this.imageUrl = newItem.logo
      this.logoData.logo = newItem.logo
    },
    // 关闭对话框
    cancelDialog() {
      this.dialogTableVisible = false
      this.dialogLogo = false
    },
    // 关闭对话框
    closeDialog() {
      this.loading = false
      this.addFormData = {}
      this.logoData = {}
      this.$refs['addForm'].clearValidate()
    },
    closeDialogLogo() {
      this.logoData = {}
      this.logoData.logo = ''
    },
    onSubmit() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          // 编辑
          const params = this.addFormData
          tenantInfoUpdate(params).then(res => {
            this.cancelDialog()
            this.loading = false
            this.openSucessMessage()
            this.loadData()
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    onSubmitLogo() {
      this.$refs['logoDialog'].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = { logo: this.logoData.logo }
          tenantLogoUpdate(params).then(res => {
            this.cancelDialog()
            this.loading = false
            this.openSucessMessage()
            this.loadData()
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    openSucessMessage() {
      this.$message({ message: '操作成功', type: 'success', duration: 1000 })
    },
    beforeAvatarUpload(file) {
      this.pdata.key = this.key + Date.parse(new Date())
      this.logoData.logo = this.hosturl + '/' + this.pdata.key
      console.log(this.logoData.logo)
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPGorPNG) {
        this.$message.error('上传头像图片只能是 JPG,PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPGorPNG && isLt2M
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // this.addFormData.imageUrl = this.hosturl + '/' + this.pdata.key
    },
    getUploadPictureToken() {
      getUploadKey().then(res => {
        const { accessKeyId, policy, signature, key } = res.data
        const pdata = { OSSAccessKeyId: accessKeyId, policy: policy, signature: signature, key: key }
        const { OSSAccessKeyId } = pdata
        this.key = key
        this.hosturl = res.data.host
        this.pdata = { OSSAccessKeyId, policy, signature, key: key + Date.parse(new Date()) }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .table {
    width: 100%;
  }
</style>
