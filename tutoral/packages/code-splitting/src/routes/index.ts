import { createRouter,createWebHistory } from "vue-router";
// import HomeView from "@/views/HomeView.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    // component: HomeView,
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/AboutView.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () => import("@/views/UserView.vue"),
  },
  {
    path: "/student",
    name: "Student",
    component: () => import("@/views/StudentView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;