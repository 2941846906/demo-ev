<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <!-- <img src="../../../assets/images/avatar.jpg" alt="" /> -->
      <img :src="img" alt="" style="width:300px"/>

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" ref="ipt" style="display:none" @change="changeImg" accept="img/*">
        <el-button type="primary" icon="el-icon-plus" @click="$refs.ipt.click()">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="flag" @click="uploadImg">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import img from '../../../assets/images/avatar.jpg'
export default {
  name: 'UserAvatar',
  data () {
    return {
      flag: true,
      img
    }
  },
  methods: {
    changeImg (e) {
      // console.dir(e.target.files)
      const files = e.target.files
      // console.log(files[0])
      const reader = new FileReader()
      reader.readAsDataURL(files[0])
      reader.onload = e => {
        // console.log(e.target.result)
        this.img = e.target.result
      }
      // console.log(res)

      this.flag = false
    },
    async uploadImg () {
      const { data: res } = await this.$http.patch('/my/update/avatar', { avatar: this.img })
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.$store.dispatch('getUserInfo')
      this.flag = false
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
</style>
