import { pGet, getQueryVariable } from './utils.mjs'

new Vue({
  template:
    `<div>
    <div v-for="(item, index) in list" :key="index">
      <el-link v-if="item.isDir" :href="'/index.html?path=' + path + item.name + '/'" type="primary">【目录】{{item.name}}</el-link>
      <el-link v-if="item.isFile" :href="'/api/download?path=' + path + item.name" type="primary">【文件】{{item.name}}</el-link>
    </div>

    <el-upload
      class="upload-demo"
      drag
      :action="'/api/upload?path=' + path"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  
  </div>`,
  el: '#app',
  data: {
    path: "",
    list: []
  },
  created() {
    this.path = getQueryVariable('path') || "/"
  },
  watch: {
    async path(val) {
      this.list = await pGet('/api/ls?path=' + val)
    }
  }
})
