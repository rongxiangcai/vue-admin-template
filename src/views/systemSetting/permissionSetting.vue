<template>
  <div style="padding: 30px 15px 0px 15px">
    <div style="display: flex;justify-content: space-between;align-items: center;background: #f1f2f3;height: 40px">
      <el-button type="primary" size="small" style="margin-left: 15px;height: 30px" @click="addItem">新增</el-button>
      <div>
        <el-input v-model="input" placeholder="角色名称" size="mini" style="width: 100px;" />
        <el-button type="primary" size="small" style="margin-right: 15px;height: 30px" @click="selectItems">查询</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-top: 30px"
    >
      <el-table-column
        label="角色名称"
        align="center"
        min-width="180"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="角色描述"
        align="center"
        min-width="180"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色操作" align="center" min-width="360">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :type="scope.row.enabled ? 'success' : 'info'"
            @click="handleOpen(scope.$index, scope.row)"
          >{{ scope.row.enabled ? '停用' : '启用' }}</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleSetting(scope.$index, scope.row)"
          >角色设置</el-button>
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
    <el-dialog :title="isEdit ? '修改角色' : '添加角色'" :visible.sync="dialogFormVisible" :before-close="beforeDialogClose" @close="closeDialog">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.description" type="textarea" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancel">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="权限设置" :visible.sync="dialogTreeVisible" :before-close="beforeDialogClose">
      <div v-loading="formLoading">
        <el-row>
          <el-col style="margin-bottom:20px;">选择权限：</el-col>
        </el-row>
        <el-tree
          v-cloak
          ref="tree"
          :data="treeData"
          show-checkbox
          :check-strictly="false"
          node-key="id"
          :default-checked-keys="treeCheck"
          :props="defaultProps"
        />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancel">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="powerSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { roleAdd, roleDelete, roleUpdate, roleEnable, roleList, permissionTree, permissionSetup } from '@/api/role'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      formLoading: false,
      // 权限id
      powerId: { id: '' },
      treeData: [],
      treeCheck: [], // 默认选中的权限
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      loading: false,
      dialogFormVisible: false,
      dialogTreeVisible: false,
      formLabelWidth: '120px',
      input: '',
      isEdit: false,
      form: {
        name: '',
        description: ''
      },
      tableData: [],
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
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
    this.loadData(this.currentPage)
  },
  methods: {
    addItem() {
      if (this.canFetchApi('/toilet/role/add')) {
        this.isEdit = false
        this.dialogFormVisible = true
      } else {
        this.$message({
          message: '您没有该权限！',
          type: 'warning'
        })
      }
    },
    selectItems() {
      if (this.input) {
        this.loadData(1, this.input)
      } else {
        this.loadData(1)
      }
    },
    beforeDialogClose(done) {
      this.form = { name: '', description: '' }
      done()
    },
    closeDialog() {
      this.$refs['form'].resetFields()
      this.form = {
        name: '',
        description: ''
      }
    },
    handleAddCancel() {
      this.form = { name: '', description: '' }
      this.dialogFormVisible = false
      this.dialogTreeVisible = false
    },
    handleAdd() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const { name, description, id } = this.form
          const params = { name, description: description, id }
          if (this.isEdit) {
            roleUpdate(params).then(res => {
              this.openSucessMessage()
              this.form = { name: '', description: '' }
              this.loadData(this.currentPage)
              this.dialogFormVisible = false
            }).then(() => {
            })
          } else {
            roleAdd(params).then(res => {
              this.openSucessMessage()
              this.form = { name: '', description: '' }
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
    handleOpen(index, row) {
      if (this.canFetchApi('/toilet/role/enable')) {
        console.log(index, row)
        const params = { roleIds: row.id, enable: !row.enabled }
        roleEnable(params).then(res => {
          this.openSucessMessage()
          this.loadData(this.currentPage)
        })
      } else {
        this.$message({
          message: '您没有该权限！',
          type: 'warning'
        })
      }
    },
    handleEdit(index, row) {
      if (this.canFetchApi('/toilet/role/update')) {
        console.log(index, row)
        this.isEdit = true
        this.dialogFormVisible = true
        this.form = { ...row }
      } else {
        this.$message({
          message: '您没有该权限！',
          type: 'warning'
        })
      }
    },
    handleDelete(index, row) {
      if (this.canFetchApi('/toilet/role/delete')) {
        console.log(index, row)
        this.$confirm('此操作将永久删除该条记录 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadingDialog = true
          const params = { roleIds: row.id }
          roleDelete(params).then(res => {
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
    openSucessMessage() {
      this.$message({
        message: '操作成功',
        type: 'success',
        duration: 1000
      })
    },
    loadData(pageNum, nameLike) {
      this.currentPage = pageNum
      this.loading = true
      const params = { pageNum: pageNum, pageSize: this.pageSize, mode: false, nameLike }
      roleList(params).then(res => {
        this.loading = false
        if (!res.isMock) {
          this.tableData = res.data.list
          this.totalSize = res.data.totalCount
        } else {
          const tableData = res.data.list
          this.tableData = tableData
        }
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    updateTree(tree) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i].menu) {
          tree[i].name = tree[i].name + '(菜单)'
        } else {
          tree[i].name = tree[i].name + '(权限)'
        }
        if (tree[i].children != null) {
          this.updateTree(tree[i].children)
        }
      }
    },
    // 显示权限界面
    handleSetting(index, row) {
      if (this.canFetchApi('/toilet/permission/setup')) {
        this.dialogTreeVisible = true
        this.powerId.id = row.id
        const params = { roleId: row.id }
        permissionTree(params).then(res => {
          this.updateTree(res.data)
          this.treeData = res.data
          this.treeCheck = []
          // 设置默认选中效果
          const fucRemoveParentId = (tree) => {
            for (let i = 0; i < tree.length; i++) {
              const item = tree[i]
              if (!item.children || item.children.length === 0) {
                if (item.selected) {
                  this.treeCheck.push(item.id)
                }
              } else {
                fucRemoveParentId(item.children)
              }
            }
          }
          fucRemoveParentId(this.treeData)
          this.$refs.tree.setCheckedKeys(this.treeCheck)
        })
      } else {
        this.$message({
          message: '您没有该权限！',
          type: 'warning'
        })
      }
    },
    powerSubmit() {
      this.formLoading = true
      console.log(this.treeData)
      const treeIds2 = this.$refs.tree.getCheckedKeys()
      const fucAppendParentId = (tree) => {
        for (let i = 0; i < tree.length; i++) {
          const item = tree[i]
          if (!item.children || item.children.length === 0) {
            if (treeIds2.indexOf(item.id) !== -1) {
              if (item.ids) {
                for (let j = 0; j < item.ids.length; j++) {
                  const id = item.ids[j]
                  if (treeIds2.indexOf(id) === -1) {
                    treeIds2.push(id)
                  }
                }
              }
              break
            }
          } else {
            for (let j = 0; j < item.children.length; j++) {
              const newItem = item.children[j]
              if (item.ids) {
                const ids = [...item.ids, item.id]
                newItem.ids = ids
              } else {
                newItem.ids = [item.id]
              }
            }
            fucAppendParentId(item.children)
          }
        }
      }
      fucAppendParentId(this.treeData)
      const params = { roleId: this.powerId.id, permisIds: treeIds2.join() }
      permissionSetup(params).then(res => {
        this.openSucessMessage()
        this.dialogTreeVisible = false
        this.treeCheck = []
        this.formLoading = false
      }).catch(() => {
        this.formLoading = false
      })
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
