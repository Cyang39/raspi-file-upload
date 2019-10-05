import { get } from "../utils.mjs"

Vue.component('yila-add-folder-button', {
  template:
    `<span>
    <el-button icon="el-icon-folder-add" @click="dialogVisible = true">新建文件夹</el-button>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>请输入文件名称：</span>
      <el-input v-model="folderName" placeholder="新建文件夹"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancle()">取 消</el-button>
        <el-button type="primary" @click="onSure()">确 定</el-button>
      </span>
    </el-dialog>
    </span>
  `,
  props: ['path'],
  data() {
    return {
      dialogVisible: false,
      folderName: ""
    }
  },
  methods: {
    onCancle() {
      this.dialogVisible = false
      this.folderName = ""
    },
    onSure() {
      get('/api/mkdir?path=' + this.path + this.folderName, (res) => {
        this.$message({
          type: 'success',
          message: '创建成功:' + JSON.stringify(res)
        })
        this.dialogVisible = false
        this.folderName = ""
      })
    }
  }
})
