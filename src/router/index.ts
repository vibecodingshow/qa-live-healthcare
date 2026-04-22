import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Consultation from '../views/Consultation.vue';
import DoctorLogin from '../views/DoctorLogin.vue';
import DoctorRoom from '../views/DoctorRoom.vue';
import Doctors from '../views/Doctors.vue';
import About from '../views/About.vue';
// 预约相关页面（懒加载）
import Appointments from '../views/Appointments.vue';
import AppointmentDetail from '../views/AppointmentDetail.vue';
import BookAppointment from '../views/BookAppointment.vue';
import DoctorSchedule from '../views/DoctorSchedule.vue';

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
  // ========== 预约挂号功能路由 ==========
  {
    path: '/appointments',
    name: 'AppointmentList',
    component: Appointments,
    meta: { title: '我的预约' },
  },
  {
    path: '/appointments/:id',
    name: 'AppointmentDetail',
    component: AppointmentDetail,
    meta: { title: '预约详情' },
  },
  {
    path: '/book/:doctorId',
    name: 'BookAppointment',
    component: BookAppointment,
    meta: { title: '预约挂号' },
  },
  {
    path: '/doctor/schedule',
    name: 'DoctorSchedule',
    component: DoctorSchedule,
    meta: { title: '门诊管理' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
