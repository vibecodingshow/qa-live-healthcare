import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Consultation from '../views/Consultation.vue';
import DoctorLogin from '../views/DoctorLogin.vue';
import DoctorRoom from '../views/DoctorRoom.vue';
import Doctors from '../views/Doctors.vue';
import About from '../views/About.vue';
import AppointmentDoctors from '../views/AppointmentDoctors.vue';

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
  // 预约挂号相关路由
  {
    path: '/appointment',
    name: 'AppointmentDoctors',
    component: AppointmentDoctors,
  },
  {
    path: '/appointment/doctor/:id',
    name: 'AppointmentDoctorDetail',
    component: () => import('../views/AppointmentDetail.vue'),
  },
  {
    path: '/appointment/my',
    name: 'MyAppointments',
    component: () => import('../views/MyAppointments.vue'),
  },
  // 医生端路由
  {
    path: '/doctor/appointments',
    name: 'DoctorAppointments',
    component: () => import('../views/DoctorAppointments.vue'),
  },
  {
    path: '/doctor/schedule',
    name: 'DoctorSchedule',
    component: () => import('../views/DoctorSchedule.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
