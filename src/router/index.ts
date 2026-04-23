import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Consultation from '../views/Consultation.vue';
import DoctorLogin from '../views/DoctorLogin.vue';
import DoctorRoom from '../views/DoctorRoom.vue';
import Doctors from '../views/Doctors.vue';
import About from '../views/About.vue';
import Appointment from '../views/appointment/Appointment.vue';
import AppointmentBook from '../views/appointment/AppointmentBook.vue';
import AppointmentSuccess from '../views/appointment/AppointmentSuccess.vue';
import MyAppointments from '../views/appointment/MyAppointments.vue';
import DoctorAppointments from '../views/doctor/DoctorAppointments.vue';

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
    path: '/appointment',
    name: 'Appointment',
    component: Appointment,
  },
  {
    path: '/appointment/book/:doctorId',
    name: 'AppointmentBook',
    component: AppointmentBook,
  },
  {
    path: '/appointment/success',
    name: 'AppointmentSuccess',
    component: AppointmentSuccess,
  },
  {
    path: '/appointment/my',
    name: 'MyAppointments',
    component: MyAppointments,
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
  {
    path: '/doctor/appointments',
    name: 'DoctorAppointments',
    component: DoctorAppointments,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
