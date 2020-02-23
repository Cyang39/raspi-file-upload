import { FM } from "./pages/fm.mjs";

const routes = [
  { path: '/', redirect: '/fm' },
  { path: '/fm', component: FM },
]

const router = new VueRouter({ routes })

new Vue({ router }).$mount('#app')