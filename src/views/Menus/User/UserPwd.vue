<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>重置密码</span>
        </div>
        <el-form :model="pwdForm" :rules="pwdRules" ref="pwdForm" label-width="100px">
            <el-form-item label="原密码" prop="old_pwd">
                <el-input v-model="pwdForm.old_pwd" style="width:400px" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="new_pwd">
                <el-input v-model="pwdForm.new_pwd" style="width:400px" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="re_pwd">
                <el-input v-model="pwdForm.re_pwd" style="width:400px" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updatePwd">修改密码</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
  name: 'DemoEvUserpwd',

  data () {
    const pwdsure = (rule, value, callback) => {
      if (value !== this.pwdForm.new_pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      pwdRules: {
        old_pwd: [
          { required: true, message: '密码不能为空', tlgger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位非空字符串', tlgger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '密码不能为空', tlgger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位非空字符串', tlgger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '密码不能为空', tlgger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位非空字符串', tlgger: 'blur' },
          { validator: pwdsure, tlgger: 'blur' }
        ]
      }
    }
  },

  methods: {
    reset () {
      this.$refs.pwdForm.resetFields()
    },
    updatePwd () {
      this.$refs.pwdForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.patch('/my/updatepwd', this.pwdForm)
        if (res.code !== 0) return
        this.$message.success(res.message)
        this.$refs.pwdForm.resetFields()
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
