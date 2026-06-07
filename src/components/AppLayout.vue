<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden" dir="rtl">
    <aside
      :class="[
        'bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl relative z-20',
        isSidebarOpen ? 'w-64' : 'w-20',
      ]"
    >
      <div
        class="h-16 flex items-center justify-between px-4 border-b border-slate-800"
      >
        <h2
          v-show="isSidebarOpen"
          class="font-black text-xl tracking-wider text-blue-400 whitespace-nowrap overflow-hidden"
        >
          ERP System
        </h2>
        <button
          @click="isSidebarOpen = !isSidebarOpen"
          class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition mx-auto"
        >
          <svg
            v-if="!isSidebarOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <nav
        class="flex-1 py-4 space-y-2 overflow-y-auto overflow-x-hidden px-3 custom-scrollbar"
      >
        <router-link
          to="/"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition group"
          title="لوحة التحكم"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">
            📊
          </span>
          <span v-show="isSidebarOpen" class="font-bold whitespace-nowrap">
            لوحة التحكم
          </span>
        </router-link>

        <router-link
          to="/products"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-600 transition group"
          title="المخزن والأصناف"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">
            📦
          </span>
          <span v-show="isSidebarOpen" class="font-bold whitespace-nowrap">
            المخزن والأصناف
          </span>
        </router-link>

        <router-link
          to="/sales"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-600 transition group"
          title="فواتير المبيعات"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">
            🛒
          </span>
          <span v-show="isSidebarOpen" class="font-bold whitespace-nowrap">
            فواتير المبيعات
          </span>
        </router-link>

        <router-link
          to="/purchases"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-600 transition group"
          title="فواتير المشتريات"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">
            🚚
          </span>
          <span v-show="isSidebarOpen" class="font-bold whitespace-nowrap">
            فواتير المشتريات
          </span>
        </router-link>

        <router-link
          to="/clients"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-600 transition group"
          title="العملاء (الديون لينا)"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">
            👥
          </span>
          <span v-show="isSidebarOpen" class="font-bold whitespace-nowrap">
            العملاء (الديون لينا)
          </span>
        </router-link>

        <router-link
          to="/client-statement"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-600 transition group"
          title="كشف حساب العملاء"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">
            📜
          </span>
          <span v-show="isSidebarOpen" class="font-bold whitespace-nowrap">
            كشف حساب العملاء
          </span>
        </router-link>

        <router-link
          to="/suppliers"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-600 transition group"
          title="الموردين (الديون علينا)"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">
            🏢
          </span>
          <span v-show="isSidebarOpen" class="font-bold whitespace-nowrap">
            الموردين (الديون علينا)
          </span>
        </router-link>

        <router-link
          to="/supplier-statement"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-600 transition group"
          title="كشف حساب الموردين"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">
            🧾
          </span>
          <span v-show="isSidebarOpen" class="font-bold whitespace-nowrap">
            كشف حساب الموردين
          </span>
        </router-link>

        <router-link
          to="/returns"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500 transition group"
          title="المرتجعات"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">
            🔄
          </span>
          <span v-show="isSidebarOpen" class="font-bold whitespace-nowrap">
            المرتجعات
          </span>
        </router-link>
      </nav>
    </aside>

    <main
      class="flex-1 h-screen overflow-y-auto relative transition-all duration-300"
    >
      <header
        class="h-16 bg-white shadow-sm border-b px-6 flex items-center justify-between sticky top-0 z-10 print:hidden"
      >
        <h1 class="font-bold text-slate-700">نظام الإدارة الشامل</h1>
        <div class="flex items-center gap-3">
          <span
            class="bg-blue-100 text-blue-700 p-2 rounded-full font-bold text-sm"
          >
            م
          </span>
          <span class="font-bold text-sm">مدير النظام</span>
        </div>
      </header>

      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

// حالة السايد بار (مفتوح افتراضياً)
const isSidebarOpen = ref(true);
</script>

<style>
/* تجميل الـ Scrollbar بتاع السايد بار عشان ميبوظش الشكل */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}

/* تنسيق خاص للينك النشط (عشان ينور لما تقف عليه) */
.router-link-active {
  background-color: #3b82f6 !important; /* لون أزرق */
  color: white !important;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
