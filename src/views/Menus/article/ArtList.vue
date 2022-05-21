<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q1" ref="qForm">
          <el-form-item label="文章分类">
            <el-select
              v-model="q1.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q1.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="filter">筛选</el-button>
            <el-button type="info" size="small" @click="hReset">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="pubVisible = true"
          >发表文章</el-button
        >
      </div>

      <!-- 文章表格区域 -->
      <el-table border stripe :data="artCateList" style="width: 100%">
        <el-table-column prop="title" label="文章标题"> </el-table-column>
        <el-table-column prop="cate_name" label="文章分类"> </el-table-column>
        <el-table-column label="发表时间">
          <template v-slot="{ row }">
            {{ format(row.pub_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态"> </el-table-column>
        <el-table-column label="操作">
         <template v-slot="{row}">
              <el-button type="danger" size="mini" @click="hDel(row.id)">删除</el-button>
         </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="q.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="发表文章"
      :visible.sync="pubVisible"
      fullscreen
      :before-close="handleClose"
      @closed="$refs.pubForm.resetFields()"
    >
      <!-- 发布文章的对话框 -->
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubForm"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="pubForm.cate_id"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="obj in cateList"
              :key="obj.id"
              :label="obj.cate_name"
              :value="obj.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 使用 v-model 进行双向的数据绑定 -->
          <quill-editor
            v-model="pubForm.content"
            @blur="$refs.pubForm.validateField('content')"
          ></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img
            v-if="pubForm.cover_img"
            :src="hImage"
            alt=""
            class="cover-img"
            ref="imgRef"
          />
          <img
            v-else
            src="../../../assets/images/cover.jpg"
            alt=""
            class="cover-img"
            ref="imgRef"
          />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input
            type="file"
            style="display: none"
            accept="image/*"
            ref="iptFile"
            @change="hImageChange"
            v-if="pubVisible"
          />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="$refs.iptFile.click()"
            >+ 选择封面</el-button
          >
        </el-form-item>
        <el-form-item prop="state">
          <el-button type="primary" @click="hPub('已发布')">发布</el-button>
          <el-button type="info" @click="hPub('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'ArtList',
  data () {
    return {
      pubVisible: false,
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      q1: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      // 表单的数据对象
      pubForm: {
        title: '',
        cate_id: '',
        // 文章的内容
        content: '',
        cover_img: '',
        state: ''
      },
      hImage: '',
      // 表单的验证规则对象
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [
          { required: true, message: '请选择文章标题', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请选择文章内容', trigger: 'blur' }
        ],
        cover_img: [
          { required: true, message: '请选择文章封面', trigger: 'blur' }
        ]
      },
      // 分类列表
      cateList: [],
      artCateList: [],
      total: 0
    }
  },
  created () {
    this.loadCateList()
    this.loadArtList()
  },
  methods: {
    handleSizeChange (val) {
    //   console.log(`每页 ${val} 条`)
      this.q.pagesize = val
      this.q.pagenum = 1
      this.loadArtList()
    },
    handleCurrentChange (val) {
    //   console.log(`当前页: ${val}`)
      this.q.pagenum = val
      this.loadArtList()
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    async loadCateList () {
      const { data: res } = await this.$http.get('/my/cate/list')
      this.cateList = res.data
    },
    hImageChange (e) {
      const files = e.target.files
      //   console.log(files)
      if (files.length === 0) {
        this.pubForm.cover_img = ''
      } else {
        this.pubForm.cover_img = files[0]
        // this.hImage = URL.createObjectURL(files[0])
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', (e) => {
          this.hImage = e.target.result
        })
        this.$refs.pubForm.validateField('cover_img')
      }
    },
    hPub (state) {
      this.pubForm.state = state
      this.$refs.pubForm.validate(async (valid) => {
        if (!valid) return
        // console.log('校验通过')
        // 发送请求
        const fd = new FormData()
        Object.keys(this.pubForm).forEach((key) => {
          fd.append(key, this.pubForm[key])
        })
        const { data: res } = await this.$http.post('/my/article/add', fd)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.pubVisible = false
        this.loadArtList()
      })
    },
    async loadArtList () {
      const { data: res } = await this.$http.get('/my/article/list', {
        params: this.q
      })
      if (res.code !== 0) return
      this.artCateList = res.data
      this.total = res.total
    },
    format (date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    filter () {
      this.q = this.q1
      this.loadArtList()
    },
    hReset () {
      this.q1 = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      this.loadArtList()
    },
    async hDel (id) {
    //   console.log(id)
      if (this.q.pagenum > 1 && this.artCateList.length === 1) {
        this.q.pagenum--
      }
      const { data: res } = await this.$http.delete('/my/article/info', { params: { id } })
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.loadArtList()
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
/deep/ .ql-editor {
  height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
</style>
