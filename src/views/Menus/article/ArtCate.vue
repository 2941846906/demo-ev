<template>
     <el-card class="box-card">
        <div slot="header" class="clearfix header-box">
            <span>文章分类</span>
            <el-button type="primary" size="mini" @click="addClass = true">添加分类</el-button>
        </div>
         <el-table
            stripe
            border
            :data="tableData"
            style="width: 100%">
            <el-table-column
                type="index"
                label="序号"
                width="80">
            </el-table-column>
            <el-table-column
                prop="cate_name"
                label="分类名称"
            >
            </el-table-column>
            <el-table-column
                prop="cate_alias"
                label="分类别名">
            </el-table-column>
            <el-table-column label="操作">
               <template v-slot="{row}">
                  <el-button type="primary" size="mini" @click="updateCate(row.id)">修改</el-button>
                  <el-button type="danger" size="mini" @click="delCate(row.id)">删除</el-button>
               </template>
            </el-table-column>
            </el-table>
            <!-- 添加分类 -->
            <el-dialog
              title="添加文章分类"
              :visible.sync="addClass"
              width="35%"
              @closed="close"
              >
              <el-form :model="addClassForm" :rules="addClassRules" ref="addClassForm" label-width="80px">
                  <el-form-item label="分类名称" prop="cate_name">
                    <el-input v-model="addClassForm.cate_name"></el-input>
                  </el-form-item>
                   <el-form-item label="分类别名" prop="cate_alias">
                    <el-input v-model="addClassForm.cate_alias"></el-input>
                  </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                  <el-button size="mini" @click="addClass = false">取 消</el-button>
                  <el-button size="mini" type="primary" @click="add">确 定</el-button>
              </span>
              </el-dialog>
              <!-- 修改分类 -->
              <el-dialog
              title="修改文章分类"
              :visible.sync="updateClass"
              width="35%"
              @closed="$refs.updateClassRules.resetFields()"
              >
              <el-form :model="updateClassForm" :rules="updateClassRules" ref="updateClassForm" label-width="80px">
                  <el-form-item label="分类名称" prop="cate_name">
                    <el-input v-model="updateClassForm.cate_name"></el-input>
                  </el-form-item>
                   <el-form-item label="分类别名" prop="cate_alias">
                    <el-input v-model="updateClassForm.cate_alias"></el-input>
                  </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="updateClass = false">取 消</el-button>
                    <el-button size="mini" type="primary" @click="addCate">确 定</el-button>
              </span>
              </el-dialog>
     </el-card>
</template>

<script>

export default {
  name: 'DemoEvArtcate',
  components: {

  },
  data () {
    return {
      tableData: [],
      addClass: false,
      updateClass: false,
      addClassForm: {
        cate_name: '',
        cate_alias: ''
      },
      updateClassForm: {
        cate_name: '',
        cate_alias: ''
      },
      addClassRules: {
        cate_name: [
          { required: true, message: '分类名称不能为空', tlgger: 'blur' },
          { pattern: /^\S{2,10}$/, message: '长度为2-10位数字字母下划线', tlgger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '分类别名不能为空', tlgger: 'blur' },
          { pattern: /^[a-zA-Z]{3,16}$/, message: '长度为3-16位非空字符串', tlgger: 'blur' }
        ]
      },
      updateClassRules: {
        cate_name: [
          { required: true, message: '分类名称不能为空', tlgger: 'blur' },
          { pattern: /^\S{2,10}$/, message: '长度为2-10位数字字母下划线', tlgger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '分类别名不能为空', tlgger: 'blur' },
          { pattern: /^[a-zA-Z]{3,16}$/, message: '长度为3-16位非空字符串', tlgger: 'blur' }
        ]
      }

    }
  },

  created () {
    this.getCateList()
  },

  methods: {
    close () {
      this.addClassForm = {
        cate_name: '',
        cate_alias: ''

      }
      this.$refs.addClassForm.resetFields()
    },
    async getCateList () {
      const { data: res } = await this.$http.get('/my/cate/list')
      if (res.code !== 0) return
      this.tableData = res.data
    },
    async updateCate (id) {
      if (id === 1 || id === 2) return this.$message.warning('管理员不允许修改该分类')
      this.updateClass = true
      // 根据id获取用户信息完成 数据回显
      const { data: res } = await this.$http.get('/my/cate/info', { params: { id } })
      this.updateClassForm = res.data
    },
    add () {
      // 添加分类
      this.$refs.addClassForm.validate(async valid => {
        if (!valid) return
        // console.log(1)
        // 发送请求
        const { data: res } = await this.$http.post('/my/cate/add', this.addClassForm)
        // console.log(res)
        if (res.code !== 0) return
        this.$message.success(res.message)
        this.getCateList()
        this.addClass = false
      })
    },
    delCate (id) {
      // 删除分类
      // console.log(id)
      if (id === 1 || id === 2) return this.$message.warning('管理员不允许删除该分类')
      this.$confirm('此操作将永久删除该分类, 是否继续?', '温馨提示提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送请求
        const { data: res } = await this.$http.delete('/my/cate/del', { params: { id } })
        if (res.code !== 0) return
        this.$message.success(res.message)
        this.getCateList()
      }).catch(() => {})
    },
    addCate () {
      // 更新文章分类
      this.$refs.updateClassForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/my/cate/info', this.updateClassForm)
        if (res.code !== 0) return
        this.$message.success(res.message)
        this.getCateList()
        this.updateClass = false
      })
    }

  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
