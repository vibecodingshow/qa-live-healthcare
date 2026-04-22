import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import './style.css';
import App from './App.vue';
import router from './router';

// 引入图标
import {
  CalendarOutlined,
  RightOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue';

const app = createApp(App);

app.use(Antd);
app.use(router);

// 注册图标组件
app.component('CalendarOutlined', CalendarOutlined);
app.component('RightOutlined', RightOutlined);
app.component('SearchOutlined', SearchOutlined);
app.component('ReloadOutlined', ReloadOutlined);

app.mount('#app');
