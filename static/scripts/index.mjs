import { pGet, getQueryVariable } from './utils.mjs'

new Vue({
  template:
    `<div>
    <div v-for="(item, index) in list">
      <div v-if="item.isDir">
        <div style="width: 20em;display:inline-block;">【目录】{{item.name}}</div>
        <a :href="'/index.html?path=' + path + item.name + '/'">进入</a>
      </div>
      <div v-if="item.isFile">
        <div style="width: 20em;display:inline-block;">【文件】{{item.name}}</div>
        <a :href="'/api/download?path=' + path + item.name">下载</a>
      </div>
    </div>
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
