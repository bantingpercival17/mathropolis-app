import { createRouter, createWebHistory } from "vue-router";
import { ScreenOrientation } from '@capacitor/screen-orientation';
import Intro from "./pages/Intro.vue";
import Map from "./pages/Map.vue";
import Quiz from "./pages/Quiz.vue";
import Login from "./pages/auth/Login.vue";
import Final from "./pages/Final.vue";
import SuperMarket from "./pages/building/SuperMarket.vue";
import BuildingLayout from "./pages/building/BuildingLayout.vue";
import HouseLayout from "./pages/building/HouseLayout.vue";
import BankLayout from "./pages/building/BankLayout.vue";
import SuperMarketV2 from "./pages/building/Super-market.vue";
import Registration from "./pages/auth/Registration.vue";
import DepartmentStore from "./pages/building/DepartmentStore.vue";
import FastFood from "./pages/building/FastFood.vue";
import Subscription from "./pages/building/OnlineSubscription.vue"
import Amusement from "./pages/building/Amusement.vue"
import TeacherView from "./pages/teacher/TeacherView.vue";

const childPage = [
  {
    path: "/home",
    name: 'home',
    meta: {
      auth: false,
      name: 'Home',
      user: 'Guest'
    }, component: Intro
  },
  { path: "/map", name: 'Map', component: Map, meta: { orientation: 'landscape' } },
  { path: "/quiz/:store", component: Quiz, props: true, meta: { orientation: 'portrait' } },
  { path: "/register", name: 'Register', component: Registration, meta: { orientation: 'landscape' } },
  { path: "/login", name: 'Login', component: Login, meta: { orientation: 'landscape' } },
  { path: "/final", component: Final },
  { path: '/auth/:pathMatch(.*)*', beforeEnter: () => window.location.href = '/auth/google' },
  { path: 'teacher', name: 'Teacher', component: TeacherView, meta: { orientation: 'landscape' } }
]
const routes = [
  {
    path: '/',
    redirect: '/home',
    name: 'home',
    name: 'client-layout',
    component: () => import('./pages/MainLayout.vue'),
    children: childPage
  },
  {
    path: "/building/house",
    name: 'house',
    component: HouseLayout,
    meta: { orientation: 'landscape' }
  },
  {
    path: "/building/bank",
    name: 'bank',
    component: BankLayout,
    meta: { orientation: 'landscape' }
  },
  {
    path: "/building/supermarket",
    name: 'supermarket',
    component: SuperMarketV2,
    meta: { orientation: 'landscape' }
  },
  {
    path: "/building/department-store",
    name: 'department-store',
    component: DepartmentStore,
    meta: { orientation: 'landscape' }
  },
  {
    path: "/building/fastfood",
    name: 'fastfood',
    component: FastFood,
    meta: { orientation: 'landscape' }
  },
  {
    path: "/building/online-subscription",
    component: Subscription,
    meta: { orientation: 'landscape' }
  },
  {
    path: "/building/amusement",
    component: Amusement,
    meta: { orientation: 'landscape' }
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.afterEach(async (to) => {
  const orientation = to.meta.orientation || 'portrait';

  try {
    await ScreenOrientation.lock({ type: orientation });
  } catch (err) {
    console.warn('Orientation lock failed:', err);
  }
});
export default router;
