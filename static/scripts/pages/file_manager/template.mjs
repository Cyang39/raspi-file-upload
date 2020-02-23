export default `
<div style="width: 800px; margin:auto">

    <span><el-button icon="el-icon-s-home" @click="path='/'" type="text">根目录</el-button></span>
    <span style="color:#ddd">|</span>
    <span><el-button @click="goBack()" icon="el-icon-arrow-left" type="text">上层</el-button></span>
    <span style="color:#ddd">|</span>
    <add-folder-button :path="path"></add-folder-button>
    <span style="color:#ddd">|&nbsp;&nbsp;&nbsp;</span>
    <el-link disabled type="info">{{path}}</el-link>

    <hr>

    <div v-if="list.length === 0">
      <span style="color:#ddd">该目录为空</span>
    </div>

    <div v-for="(item, index) in list" :key="index">
      <span style="width:500px;display:inline-block;">
        <el-link v-if="item.isDir" @click="updatePath(item.name)" type="warning"><i class="el-icon-folder"></i> {{item.name}}</el-link>
        <el-link v-if="item.isFile" disabled type="primary"><i class="el-icon-document"></i> {{item.name}}</el-link>
      </span>

      <el-link v-if="item.isFile" type="danger" @click="deleteItem(item.name)">删除</el-link>
      <el-link v-else type="danger" @click="deleteDir(item.name)">删除目录</el-link>
      
      <el-link v-if="item.isFile" :href="'/api/download?path=' + path + item.name" type="primary">下载</el-link>
    </div>
    
    <hr>

    <el-upload drag :action="'/api/upload?path=' + path" multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  
</div>
`