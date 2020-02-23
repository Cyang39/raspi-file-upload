import FM from "./pages/file_manager/index.mjs";

const routes = [
  { path: '/', redirect: '/fm' },
  { path: '/fm', component: FM },
]

const router = new VueRouter({ routes })

new Vue({ router }).$mount('#app')