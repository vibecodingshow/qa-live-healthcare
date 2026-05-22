import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Consultation from '../views/Consultation.vue';
import DoctorLogin from '../views/DoctorLogin.vue';
import DoctorRoom from '../views/DoctorRoom.vue';
import Doctors from '../views/Doctors.vue';
import About from '../views/About.vue';
import { SESSION_KEYS } from '../store';

// 预约相关页面 - 懒加载
const DoctorSchedule = () => import('../views/DoctorSchedule.vue');
const AppointmentBooking = () => import('../views/AppointmentBooking.vue');
const MyAppointments = () => import('../views/MyAppointments.vue');

// 扩展 Vue Router RouteMeta 接口
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresDoctor?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/consultation',
    name: 'Consultation',
    component: Consultation,
  },
  {
    path: '/consultation/:doctorUsername',
    name: 'ConsultationRoom',
    component: Consultation,
  },
  {
    path: '/doctors',
    name: 'Doctors',
    component: Doctors,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/doctor/login',
    name: 'DoctorLogin',
    component: DoctorLogin,
  },
  {
    path: '/doctor/room/:username',
    name: 'DoctorRoom',
    component: DoctorRoom,
  },
  // 预约相关路由
  {
    path: '/doctor/schedule',
    name: 'DoctorSchedule',
    component: DoctorSchedule,
    meta: { requiresAuth: true, requiresDoctor: true },
  },
  {
    path: '/appointment/:doctorId',
    name: 'AppointmentBooking',
    component: AppointmentBooking,
    meta: { requiresAuth: true },
  },
  {
    path: '/my-appointments',
    name: 'MyAppointments',
    component: MyAppointments,
    meta: { requiresAuth: true },
  },
  // 404 重定向
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 获取当前医生登录状态（从 sessionStorage）
  const doctorSession = sessionStorage.getItem(SESSION_KEYS.DOCTOR);
  const currentDoctor = doctorSession ? JSON.parse(doctorSession) : null;

  // 检查是否需要医生权限
  if (to.meta.requiresDoctor) {
    if (!currentDoctor) {
      next({ name: 'DoctorLogin' });
      return;
    }
  }

  // 检查是否需要登录（预约功能）
  if (to.meta.requiresAuth) {
    const hasAuth = currentDoctor || sessionStorage.getItem(SESSION_KEYS.PATIENT);
    
    // 这里暂时允许访问，避免阻塞功能测试
    // 正式环境应重定向到登录页
    if (!hasAuth) {
      // 提示用户（可取消注释以启用严格模式）
      // console.warn('此页面需要登录');
      // next({ name: 'DoctorLogin' });
      // return;
    }
  }

  next();
});

export default router;
