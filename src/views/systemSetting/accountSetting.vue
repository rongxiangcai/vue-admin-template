<template>
  <div style="padding: 30px 15px 0px 15px">
    <div style="display: flex;justify-content: space-between;align-items: center;background: #f1f2f3;height: 40px">
      <el-button type="primary" size="small" style="margin-left: 15px;height: 30px" @click="addItem">新增</el-button>
      <div>
        <el-input v-model="input" placeholder="账号" size="mini" style="width: 100px;" />
        <el-select v-model="value" placeholder="请选择角色" size="mini">
          <el-option
            v-for="item in roleIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" size="small" style="margin-right: 15px;height: 30px" @click="selectItems">查询</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-top: 30px"
    >
      <el-table-column
        label="账号"
        align="center"
        min-width="180"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="角色"
        align="center"
        min-width="180"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ getRowRoles(scope.row.roles) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;padding: 5px 15px 5px 15px;margin-top: 10px;background: #f1f2f3">
      <span />
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="totalSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="isEdit ? '修改账号' : '添加账号'" :visible.sync="dialogFormVisible" :before-close="beforeDialogClose" @close="closeForm">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号名称" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色" prop="valueArray">
          <el-select v-model="form.valueArray" multiple placeholder="请选择">
            <el-option
              v-for="item in roleIdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" auto-complete="off" />
          <span v-if="!isEdit" style="color: red">初始密码为：a123456</span>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancel">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { userAdd, userDelete, userUpdate, roleList, userList } from '@/api/role'
import { mapState } from 'vuex'
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      loading: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      isEdit: false,
      value: '',
      roleIdOptions: [],
      input: '',
      form: {
        account: '',
        roleIds: '',
        password: 'a123456',
        confirmPassword: 'a123456',
        valueArray: [],
        id: ''
      },
      tableData: [],
      rules: {
        account: [
          { required: true, message: '请输入账号名称', trigger: 'blur' }
        ],
        valueArray: [
          { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      roles: state => state.user.roles
    })
  },
  created() {},
  mounted() {
    this.getRoles()
    this.loadData(this.currentPage)
  },
  methods: {
    addItem() {
      if (this.canFetchApi('/toilet/user/add')) {
        this.isEdit = false
        this.dialogFormVisible = true
        this.form = {
          account: '',
          roleIds: '',
          password: 'a123456',
          confirmPassword: 'a123456',
          valueArray: [],
          id: ''
        }
        // this.$refs['form'].resetFields()
      } else {
        this.$message({
          message: '您没有该权限！',
          type: 'warning'
        })
      }
    },
    handleEdit(index, row) {
      if (this.canFetchApi('/toilet/user/update')) {
        console.log(index, row)
        this.isEdit = true
        this.dialogFormVisible = true
        this.form = JSON.parse(JSON.stringify(row))
      } else {
        this.$message({
          message: '您没有该权限！',
          type: 'warning'
        })
      }
    },
    handleDelete(index, row) {
      if (this.canFetchApi('/toilet/user/delete')) {
        console.log(index, row)
        this.$confirm('此操作将永久删除该条记录 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadingDialog = true
          const params = { userIds: row.id }
          userDelete(params).then(res => {
            this.loadingDialog = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.loadData(this.currentPage)
          }).catch(() => {
            this.loadingDialog = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          message: '您没有该权限！',
          type: 'warning'
        })
      }
    },
    handleSetting(index, row) {
      console.log(index, row)
    },
    selectItems() {
      this.loadData(1, this.input, this.value ? this.value : null)
    },
    getRoles() {
      const params = { pageNum: 1, pageSize: 50, mode: false }
      roleList(params).then(res => {
        this.loading = false
        this.roleIdOptions = res.data.list.map((item, index) => {
          const newItem = { value: item.id, label: item.name }
          return newItem
        })
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    handleAdd() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const { account, password, valueArray, id } = this.form
          let roleIds = ''
          valueArray.forEach((item, index) => {
            index === valueArray.length - 1 ? roleIds = roleIds + item : roleIds = roleIds + item + ','
          })
          if (this.isEdit) {
            const params = { account, password, roleIds, id }
            userUpdate(params).then(res => {
              this.openSucessMessage()
              this.$refs['form'].resetFields()
              this.loadData(this.currentPage)
              this.dialogFormVisible = false
            }).then(() => {
            })
          } else {
            const params = { account, password, roleIds }
            userAdd(params).then(res => {
              this.openSucessMessage()
              this.$refs['form'].resetFields()
              this.loadData(this.currentPage)
              this.dialogFormVisible = false
            }).then(() => {
            })
          }
        } else {
          return false
        }
      })
    },
    closeForm() {
      this.form = {
        account: '',
        roleIds: '',
        password: 'a123456',
        confirmPassword: 'a123456',
        valueArray: [],
        id: ''
      }
    },
    loadData(pageNum, accountLike, roleId) {
      this.currentPage = pageNum
      this.loading = true
      const params = { pageNum: pageNum, pageSize: this.pageSize, mode: false, accountLike, roleId }
      userList(params).then(res => {
        this.loading = false
        this.tableData = res.data.list.map(item => {
          const tempArray = []
          item.roles.forEach((item, index) => {
            tempArray.push(item.id)
          })
          item.valueArray = tempArray
          return item
        })
        this.totalSize = res.data.totalCount
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    openSucessMessage() {
      this.$message({
        message: '操作成功',
        type: 'success',
        duration: 1000
      })
    },
    getRowRoles(roles) {
      let str = ''
      roles.forEach((item, index) => {
        index === roles.length - 1 ? str = str + item.name : str = str + item.name + ','
      })
      return str
    },
    // 每页数据数目改变的时
    handleSizeChange(val) {
      this.pageSize = val
      const totalPage = Math.ceil(this.totalSize / val)
      totalPage < this.currentPage ? this.loadData(totalPage) : this.loadData(this.currentPage)
    },
    handleCurrentChange(val) {
      this.loadData(val)
    },
    beforeDialogClose(done) {
      this.$refs['form'].resetFields()
      done()
    },
    handleAddCancel() {
      // this.form = { account: '', roleIds: '', password: 'a123456', confirmPassword: 'a123456', valueArray: [] }
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
    },
    canFetchApi(path) {
      let back = true
      for (let i = 0; i < this.roles.length; i++) {
        if (this.roles[i] === path) {
          back = true
          break
        }
      }
      return back
    }
  }
}
</script>
