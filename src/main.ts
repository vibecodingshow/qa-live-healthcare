import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import './style.css';
import App from './App.vue';
import router from './router';
import { initializeSampleSchedules } from './data/appointment';

// 初始化示例排班数据（仅在 localStorage 为空时生效）
initializeSampleSchedules();

const app = createApp(App);

app.use(Antd);
app.use(router);
app.mount('#app');
