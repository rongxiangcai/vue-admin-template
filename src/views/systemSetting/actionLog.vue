<template>
  <div class="page-container">
    <div class="top-bar-container">
      <el-button class="top-bar-add" type="primary" size="small" @click="addData">新增</el-button>
      <div>

<!--        <el-date-picker-->
<!--          v-model="searchDateArr"-->
<!--          size="small"-->
<!--          value-format="timestamp"-->
<!--          type="datetimerange"-->
<!--          range-separator="至"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--        />-->

                <el-date-picker
                  size="small"
                  value-format="timestamp"
                  v-model="searchDateArr"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
        <el-input v-model="searchText" class="top-bar-input-name" clearable placeholder="账号" size="small" />
        <el-button class="top-bar-button-search" type="primary" size="small" @click="selectData">查询</el-button>
      </div>
    </div>
    <el-table class="table" :data="tableData" border @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" align="center" width="55" />-->
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="账号" prop="operateAccount" align="center" />
      <el-table-column label="ip" prop="remoteIp" align="center" />
      <el-table-column label="操作记录" prop="methodName" align="center" />
      <el-table-column label="操作结果" prop="responseMsg" align="center" />
      <el-table-column label="操作时间" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ datestamp2date(scope.row.createStamp) }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" min-width="180" label="操作">-->
      <!--        <template slot-scope="scope">-->
      <!--          <div style="display: flex;justify-content: center">-->
      <!--            <el-button-->
      <!--              size="mini"-->
      <!--              @click="handleEdit(scope.$index, scope.row)"-->
      <!--            >编辑</el-button>-->
      <!--            <el-button-->
      <!--              size="mini"-->
      <!--              type="danger"-->
      <!--              @click="handleDelete(scope.$index, scope.row)"-->
      <!--            >删除</el-button>-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
    <div class="bottom-bar-container">
      <el-button class="multiple-delete-button" type="primary" size="small" @click="multipleDelete">批量删除</el-button>
      <el-pagination
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.totalSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog :title="isEdit ? '修改' : '新增'" :visible.sync="dialogTableVisible" width="500px" @close="closeDialog('addForm')">
      <el-form ref="addForm" v-loading="loading" :model="addFormData" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addFormData.name" class="form-input-common" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <div v-if="loading" v-loading="loading" class="loadingView" />
  </div>
</template>

<script>
import { bookAdd, bookDelete, bookUpdate, logPage } from '@/api/api'

export default {
  data() {
    return {
      searchDateArr: [],
      multipleSelection: [],
      tableData: [{ name: 'rose' }],
      searchText: '',
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalSize: 0
      },
      dialogTableVisible: false,
      isEdit: false,
      addFormData: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      // 加载模态控制
      loading: false
    }
  },
  mounted() {
    this.loadData(1)
  },
  methods: {
    onSubmit() {
      const _self = this
      function commonSucessResponse() {
        _self.loading = false
        _self.openSucessMessage()
        _self.loadData(_self.pagination.currentPage)
        _self.dialogTableVisible = false
      }
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            // 编辑
            const params = this.addFormData
            bookUpdate(params).then(res => {
              commonSucessResponse()
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 添加
            const params = this.addFormData
            delete params.id
            bookAdd(params).then(res => {
              commonSucessResponse()
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    },
    openSucessMessage() {
      this.$message({ message: '操作成功', type: 'success', duration: 1000 })
    },
    // 顶部工具条======start
    // 添加数据
    addData() {
      this.dialogTableVisible = true
      this.isEdit = false
    },
    // 查询数据
    selectData() {
      this.loadData(1)
    },
    // 顶部工具条======end

    // 多选选择改变
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 关闭对话框
    cancelDialog() {
      this.dialogTableVisible = false
    },
    // 关闭对话框
    closeDialog(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields()
      }
    },

    // 底部工具条======start
    // 页码数量改变
    handleSizeChange(val) {
      this.pagination.pageSize = val
      const totalPage = Math.ceil(this.pagination.totalSize / val)
      totalPage < this.pagination.currentPage ? this.loadData(totalPage) : this.loadData(this.pagination.currentPage)
    },
    // 页码改变
    handleCurrentChange(val) {
      this.loadData(val)
    },
    // 底部工具条======end
    // 编辑，删除，批量删除
    handleEdit(index, row) {
      this.isEdit = true
      this.dialogTableVisible = true
      const newItem = { ...row }
      this.addFormData = newItem
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该条记录 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.loading = true
        const params = { ids: row.id }
        bookDelete(params).then(res => {
          this.loading = false
          this.$message({ type: 'success', message: '删除成功!' })
          this.loadData(this.pagination.currentPage)
        }).catch(() => {
          this.loading = false
        })
      })
    },
    multipleDelete() {
      if (this.multipleSelection && this.multipleSelection.length < 1) {
        return
      }
      this.$confirm('此操作将永久删除该条记录 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.loading = true
        const multipleSelection = this.multipleSelection
        const ids = multipleSelection.map(item => {
          return item.id
        }).join()
        const params = { ids: ids }
        bookDelete(params).then(res => {
          this.loading = false
          this.$message({ type: 'success', message: '删除成功!' })
          this.loadData(this.pagination.currentPage)
        }).catch(() => {
          this.loading = false
        })
      })
    },
    loadData(pageNum) {
      this.pagination.currentPage = pageNum
      this.loading = true
      const params = { pageNum: pageNum, pageSize: this.pagination.pageSize, mode: false }
      if (this.searchText) {
        params.accountLike = this.searchText
      }
      if (this.searchDateArr.length > 1) {
        params.begin = this.searchDateArr[0]
        params.end = this.searchDateArr[1]
      }
      logPage(params).then(res => {
        this.loading = false
        this.tableData = res.data.list
        this.pagination.totalSize = res.data.totalCount
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-container {
    padding: 30px 15px 0 15px;
    position: relative;
  }
  .top-bar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f1f2f3;
    height: 40px;
  }
  .top-bar-add {
    margin-left: 15px;
    height: 30px;
    visibility: hidden;
  }
  .top-bar-input-name {
    width: 150px;
    margin-right: 10px;
  }
  .top-bar-button-search {
    margin-right: 15px;
    height: 30px;
  }
  .table {
    width: 100%;
    margin-top: 20px;
  }
  .bottom-bar-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px 15px 5px 15px;
    margin-top: 10px;
    background: #f1f2f3
  }
  .multiple-delete-button {
    visibility: hidden;
  }
  .form-input-common {
    width: 300px;
  }
  .loadingView {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 100vh;
  }

</style>
