import { pGet, getQueryVariable, changeURLPar } from './utils.mjs'

new Vue({
  template:
    `<div style="width: 800px; margin:auto">

      <el-button icon="el-icon-s-home" @click="path='/'" type="text">根目录</el-button>
      <span style="color:#ddd">|</span>
      <span><el-button @click="goBack()" icon="el-icon-arrow-left" type="text">上层</el-button></span>
      <span style="color:#ddd">|</span>
      <yila-add-folder-button :path="path"></yila-add-folder-button>
      <span style="color:#ddd">|&nbsp;&nbsp;&nbsp;</span>
      <span>{{path}}</span>
      <hr>

      <div v-if="list.length === 0">
        <span style="color:#ddd">该目录为空</span>
      </div>

      <div class="hdir-list-line" v-for="(item, index) in list" :key="index">
        <span class="hdir-list-item dir" v-if="item.isDir" @click="updatePath(item.name)"><i class="el-icon-folder"></i> {{item.name}}</span>
        <span class="hdir-list-item" v-if="item.isFile"><i class="el-icon-document"></i> {{item.name}}</span>
        <span class="hbtn warn" v-if="item.isFile" @click="deleteItem(item.name)">删除</span>
        <span class="hbtn warn" v-else @click="deleteDir(item.name)">删除目录</span>
        <a class="hbtn" v-if="item.isFile" :href="'/api/download?path=' + path + item.name">下载</a>
      </div>
      
      <hr>

      <el-upload
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
    window.onpopstate = () => {
      let tmp = getQueryVariable('path')
      if(tmp && tmp[tmp.length - 1] !== '/') tmp += '/'
      this.path = tmp || "/"
    }
    let tmp = getQueryVariable('path')
    if(tmp && tmp[tmp.length - 1] !== '/') tmp += '/'
    this.path = tmp || "/"
  },
  watch: {
    path() {
      this.updateList()
      let newPath = changeURLPar(document.URL, 'path', this.path)
      history.pushState(null, null, newPath)
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
    deleteDir(name) {
      this.$confirm('此操作将永久删除该目录, 是否继续?','警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let msg = await pGet('/api/delete?path=' + this.path + name)
        if(msg !== 'success') {
          this.$message({
            type: 'info',
            message: msg
          });   
        } else {
          this.updateList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });   
      })
    },
    goBack() {
      if(this.path === '/') return;
      const curPath = this.path.split('/').filter(x => x)
      curPath.pop()
      curPath.unshift('')
      this.path = curPath.join('/') + '/'
    },
    updatePath(name) {
      this.path = this.path + name + '/'
    }
  }
})
