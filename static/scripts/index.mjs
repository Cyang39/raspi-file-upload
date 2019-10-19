import { pGet, getQueryVariable } from './utils.mjs'

new Vue({
  template:
    `<div style="width: 800px; margin:auto">

      <yila-add-folder-button :path="path"></yila-add-folder-button>

      <hr>

      <div class="hdir-list-line" v-for="(item, index) in list" :key="index">
        <a class="hdir-list-item" v-if="item.isDir" :href="'/index.html?path=' + path + item.name + '/'">🗂 {{item.name}}</a>
        <span class="hdir-list-item" v-if="item.isFile">📄 {{item.name}}</span>
        <span class="hbtn warn" v-if="item.isFile" @click="deleteItem(item.name)">删除</span>
        <a class="hbtn" v-if="item.isFile" :href="'/api/download?path=' + path + item.name">下载</a>
      </div>
      
      <hr>

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
    path() {
      this.updateList()
    }
  },
  methods: {
    async updateList() {
      this.list = await pGet('/api/ls?path=' + this.path)
    },
    deleteItem(name) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log(await pGet('/api/delete?path=' + this.path + name))
        this.updateList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    goBack() {
      console.log("back")
    }
  }
})
