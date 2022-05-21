<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form :model="userForm" :rules="userRules" ref="userForm" label-width="100px">
        <el-form-item label="登录名称"  >
            <el-input v-model="userForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname" >
            <el-input v-model="userForm.nickname" ></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱"  prop="email">
            <el-input v-model="userForm.email" ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="commit">提交修改</el-button>
            <el-button @click="reset">重置</el-button>
        </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'UserInfo',
  data () {
    return {
      userForm: { ...this.$store.state.userInfo },
      userRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', tlgger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位非空字符串', tlgger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset () {
      // 重置
      this.$refs.userForm.resetFields()
    },
    commit () {
      // 提交修改
      // 兜底校验
      this.$refs.userForm.validate(async valid => {
        if (!valid) return
        // console.log(1)
        // 发送请求
        const { data: res } = await this.$http.put('/my/userinfo', this.userForm)
        if (res.code !== 0) return
        this.$message.success(res.message)
        this.$store.dispatch('getUserInfo')
      })
    }
  },

  computed: {
    ...mapState(['userInfo'])
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
