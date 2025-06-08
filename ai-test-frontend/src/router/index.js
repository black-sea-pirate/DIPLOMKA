// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";

/* ---------- ленивые импорты ---------- */
const Login = () => import("../pages/Login.vue");
const Register = () => import("../pages/Register.vue");

const MainLayout = () => import("../layouts/MainLayout.vue");

/* teacher */
const TeacherDashboard = () => import("../pages/teacher/Dashboard.vue");
const TeacherTests = () => import("../pages/teacher/Tests.vue");
const TeacherAnalytics = () => import("../pages/teacher/Analytics.vue");

/* student */
const StudentDashboard = () => import("../pages/student/Dashboard.vue");
const StudentTestSession = () => import("../pages/student/TestSession.vue");
const StudentResults = () => import("../pages/student/Results.vue");

/* ---------- маршруты ---------- */
const routes = [
  /* public */
  { path: "/login", name: "Login", component: Login, meta: { public: true } },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { public: true },
  },

  /* protected layout */
  {
    path: "/",
    component: MainLayout,
    children: [
      /* TEACHER ---------------------------------------------------------- */
      {
        path: "teacher",
        children: [
          {
            path: "",
            name: "TeacherDashboard",
            component: TeacherDashboard,
            meta: { role: "teacher" },
          },
          {
            path: "tests",
            name: "TeacherTests",
            component: TeacherTests,
            meta: { role: "teacher" },
          },
          {
            path: "analytics",
            name: "TeacherAnalytics",
            component: TeacherAnalytics,
            meta: { role: "teacher" },
          },
        ],
      },
      /* STUDENT ---------------------------------------------------------- */
      {
        path: "student",
        children: [
          {
            path: "",
            name: "StudentDashboard",
            component: StudentDashboard,
            meta: { role: "student" },
          },
          {
            path: "session",
            name: "StudentTestSession",
            component: StudentTestSession,
            meta: { role: "student" },
          },
          {
            path: "results",
            name: "StudentResults",
            component: StudentResults,
            meta: { role: "student" },
          },
        ],
      },
    ],
  },

  /* fallback */
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

/* ---------- роутер ---------- */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* ---------- global guard ---------- */
router.beforeEach((to) => {
  const user = useUserStore();

  // публичные маршруты — свободный доступ
  if (to.meta.public) return true;

  // если нет токена → /login
  if (!user.isAuth) return "/login";

  // проверка роли
  if (to.meta.role && to.meta.role !== user.role) {
    return user.role === "teacher" ? "/teacher" : "/student";
  }

  return true;
});

export default router;
