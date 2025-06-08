/* ===========================================================================
   src/router/index.js

   Маршрутизация приложения построена на Vue Router 4
   (history-режим, SPA-навигация без перезагрузок).

   👉 Ключевые идеи, которые должен понять trainee:

   1)  «Ленивые» импорты (dynamic import) — компонент грузится,
       только когда пользователь реально переходит по маршруту.
       Это уменьшает размер начального бандла.

   2)  Layout-маршруты:  путь «/» рендерит MainLayout,
       а все teacher/student-страницы вкладываются внутрь как children.
       Благодаря этому Navbar + Sidebar рисуются один раз.

   3)  Global beforeEach guard — универсальная «охрана».
       • пускает Public-страницы без проверки
       • если нет токена → перенаправляет на /login
       • если роль не совпадает с meta.role → перебрасывает на «домашнюю»
         для текущей роли.

   После подключения настоящего backend код роутера НЕ придётся менять —
   guard уже опирается на user.isAuth и user.role, которые будут
   устанавливаться через /auth/login.
=========================================================================== */

import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";

/* ─────────────── ЛЕНИВЫЕ ИМПОРТЫ (dynamic import) ───────────────
   Синтаксис () => import('...') заставляет Vite создать отдельный
   chunk *.js, который подгрузится по требованию.                                 */
const Login = () => import("@/pages/Login.vue");
const Register = () => import("@/pages/Register.vue");

const MainLayout = () => import("@/layouts/MainLayout.vue");

/* teacher pages */
const TeacherDashboard = () => import("@/pages/teacher/Dashboard.vue");
const TeacherTests = () => import("@/pages/teacher/Tests.vue");
const TeacherAnalytics = () => import("@/pages/teacher/Analytics.vue");

/* student pages */
const StudentDashboard = () => import("@/pages/student/Dashboard.vue");
const StudentTestSession = () => import("@/pages/student/TestSession.vue");
const StudentResults = () => import("@/pages/student/Results.vue");

/* ─────────────── ОПИСАНИЕ МАРШРУТОВ ─────────────── */
const routes = [
  /* PUBLIC -------------------------------------------------------------- */
  { path: "/login", name: "Login", component: Login, meta: { public: true } },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { public: true },
  },

  /* PROTECTED (под MainLayout) ------------------------------------------ */
  {
    path: "/",
    component: MainLayout, // Navbar + Sidebar
    children: [
      /* ---------- TEACHER -------- */
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
      /* ---------- STUDENT -------- */
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

  /* fallback: любой неизвестный адрес → /login */
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

/* ─────────────── СОЗДАНИЕ РОУТЕРА ─────────────── */
const router = createRouter({
  history: createWebHistory(), // clean URL (/teacher) без #hash
  routes,
});

/* ─────────────── ГЛОБАЛЬНЫЙ GUARD ───────────────
   Вызывается перед каждым переходом                         */
router.beforeEach((to) => {
  const user = useUserStore();

  /* 1. Public-маршруты доступны всегда */
  if (to.meta.public) return true;

  /* 2. Нет токена?  → отправляем на /login  */
  if (!user.isAuth) return "/login";

  /* 3. Проверяем роль маршрута */
  if (to.meta.role && to.meta.role !== user.role) {
    // Пользователь залогинен, но пытается открыть «чужую» страницу
    return user.role === "teacher" ? "/teacher" : "/student";
  }

  /* 4. Всё ок, переход разрешён */
  return true;
});

export default router;
/* Что trainee изменит при реальном backend
guard остаётся тот же — флаг user.isAuth и user.role будут устанавливаться
после успешного запроса /auth/login.

Если добавятся новые страницы, достаточно дописать ленивый импорт и объект
маршрута, копируя существующий шаблон. */
