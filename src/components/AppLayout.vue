<template>
  <div class="flex h-screen bg-gray-50" dir="rtl">
    <aside
      class="w-64 bg-slate-800 text-white flex flex-col transition-all duration-300"
    >
      <div
        class="h-16 flex items-center justify-center border-b border-slate-700 shadow-md"
      >
        <h1 class="text-2xl font-bold text-blue-400 flex items-center gap-2">
          <span>⚙️</span>
          ERP System
        </h1>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto mt-2">
        <router-link
          to="/"
          class="block px-4 py-3 rounded-lg hover:bg-slate-700 transition"
          active-class="bg-blue-600 hover:bg-blue-600 font-semibold"
        >
          📊 لوحة التحكم
        </router-link>

        <div class="text-xs text-slate-400 font-semibold mt-6 mb-2 px-4">
          إدارة العمليات
        </div>

        <router-link
          to="/products"
          class="block px-4 py-3 rounded-lg hover:bg-slate-700 transition text-gray-300"
          active-class="bg-blue-600 text-white font-semibold"
        >
          📦 المخزن والأصناف
        </router-link>
        <router-link
          to="/sales"
          class="block px-4 py-3 rounded-lg hover:bg-slate-700 transition text-gray-300"
          active-class="bg-green-600 text-white font-semibold"
        >
          🛒 فواتير المبيعات
        </router-link>
        <router-link
          to="/purchases"
          class="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-600 transition text-white"
          active-class="bg-blue-600 font-bold"
        >
          <span>🚚</span>
          <span>فواتير المشتريات</span>
        </router-link>
        <router-link
          to="/clients"
          class="block px-4 py-3 rounded-lg hover:bg-slate-700 transition text-gray-300"
          active-class="bg-blue-600 text-white font-semibold"
        >
          👥 العملاء (الديون لينا)
        </router-link>

        <router-link
          to="/client-statement"
          class="block px-4 py-3 rounded-lg hover:bg-slate-700 transition text-gray-300"
          active-class="bg-blue-600 text-white font-semibold"
        >
          <span>📜</span>
          <span>كشف حساب العملاء</span>
        </router-link>

        <router-link
          to="/suppliers"
          class="block px-4 py-3 rounded-lg hover:bg-slate-700 transition text-gray-300"
          active-class="bg-purple-600 text-white font-semibold"
        >
          🏢 الموردين (الديون علينا)
        </router-link>

        <router-link
          to="/supplier-statement"
          class="block px-4 py-3 rounded-lg hover:bg-slate-700 transition text-gray-300"
          active-class="bg-purple-600 text-white font-semibold"
        >
          <span>📜</span>
          <span>كشف حساب الموردين</span>
        </router-link>

        <router-link
          to="/returns"
          class="block px-4 py-3 rounded-lg hover:bg-slate-700 transition text-gray-300"
          active-class="bg-orange-500 text-white font-semibold"
        >
          🔄 المرتجعات
        </router-link>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="h-16 bg-white shadow-sm flex items-center px-6 justify-between border-b z-10"
      >
        <h2 class="text-xl font-semibold text-gray-800">نظام الإدارة الشامل</h2>

        <div
          class="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 cursor-pointer hover:bg-gray-100 transition"
        >
          <div
            class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm"
          >
            م
          </div>
          <span class="text-sm font-medium text-gray-700 pr-1">
            مدير النظام
          </span>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

