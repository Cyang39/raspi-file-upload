import { pGet, getQueryVariable, changeURLPar } from '../../utils.mjs'

// import components used in this page
import add_folder_button from "../file_manager/components/add_folder_button.mjs"
Vue.component('add-folder-button', add_folder_button)

// import template of this page
import template from "./template.mjs"

// the vue object of this page
export default {
  template,
  data() {
    return {
      path: "",
      list: []
    }
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
}