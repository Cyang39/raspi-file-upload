import { pGet, getQueryVariable } from './utils.mjs'

new Vue({
  template:
    `<el-container>

    <el-container>

      <el-main>

      <yila-add-folder-button :path="path"></yila-add-folder-button>

      <el-row v-for="(item, index) in list" :key="index" style="margin:.1em">
      <el-col :span="6">
        <el-link v-if="item.isDir" :href="'/index.html?path=' + path + item.name + '/'" type="primary">【目录】{{item.name}}</el-link>
        <el-link v-if="item.isFile" :href="'/api/download?path=' + path + item.name" type="primary">【文件】{{item.name}}</el-link>
      </el-col>
      <el-col :span="6">
        <span class="hbtn" @click="deleteItem(item.name)">删除</span>
      </el-col>
      </el-row>
      
      <br>

      <el-upload
        class="upload-demo"
        drag
        :action="'/api/upload?path=' + path"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-main>
  
    </el-container>
    
  </el-container>`,
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
