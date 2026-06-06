import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "../components/AppLayout.vue";
import Dashboard from "../views/Dashboard.vue";
import Products from "../views/Products.vue";
import Sales from "../views/Sales.vue";
import Clients from "../views/Clients.vue";
import Suppliers from "../views/Suppliers.vue";
import Returns from "../views/Returns.vue";
import Login from "../views/Login.vue"; // استدعاء شاشة الدخول
import Purchases from "../views/Purchases.vue";
import ClientStatement from "../views/ClientStatement.vue";
import SupplierStatement from "../views/SupplierStatement.vue";

const routes = [
  {
    // شاشة الدخول حرة ومش محتاجة Layout
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    // الهيكل الأساسي بتاع السيستم
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: true }, // علامة إن المسار ده محمي
    children: [
      { path: "", name: "Dashboard", component: Dashboard },
      { path: "products", name: "Products", component: Products },
      { path: "sales", name: "Sales", component: Sales },
      { path: "clients", name: "Clients", component: Clients },
      { path: "suppliers", name: "Suppliers", component: Suppliers },
      { path: "returns", name: "Returns", component: Returns },
      {
        path: "/purchases",
        name: "purchases",
        component: Purchases,
      },
      {
        path: "/client-statement",
        name: "ClientStatement",
        component: ClientStatement,
      },
      {
        path: "/supplier-statement",
        name: "SupplierStatement",
        component: SupplierStatement,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// حارس البوابة (Navigation Guard)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    // لو الصفحة محمية ومفيش توكن، روح للوجين
    next({ name: "Login" });
  } else if (to.name === "Login" && token) {
    // لو هو عامل لوجين وبيحاول يروح لشاشة الدخول تاني، رجعه للداش بورد
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;

