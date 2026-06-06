<template>
  <div class="p-6 bg-slate-50 min-h-screen" dir="rtl">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-black text-slate-900">
          لوحة الإحصائيات الختامية والربحية
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          مراقبة حية وتتبع فوري لجميع الحسابات والفواتير الجارية
        </p>
      </div>
      <div
        class="text-sm bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold text-slate-700 shadow-sm"
      >
        🔄 تحديث تلقائي:
        <span class="text-blue-600 font-mono">{{ currentTime }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <div
        class="bg-gradient-to-br from-indigo-900 to-slate-900 p-5 rounded-2xl text-white shadow-md flex flex-col justify-between group border border-indigo-950"
      >
        <div class="flex justify-between items-center mb-3">
          <span
            class="text-[10px] font-bold text-indigo-200 uppercase tracking-wider"
          >
            صافي الأرباح الحالية
          </span>
          <span class="p-1.5 bg-indigo-800/60 text-white rounded-lg text-base">
            💎
          </span>
        </div>
        <div>
          <h3 class="text-2xl font-black font-mono text-indigo-300">
            {{ stats.net_profit }}
            <span class="text-xs font-bold text-white">ج</span>
          </h3>
          <p class="text-[10px] text-indigo-200 font-medium mt-1">
            ✨ ناتج (البيع - تكلفة الشراء)
          </p>
        </div>
        <div
          class="border-t border-indigo-800/60 mt-3 pt-2 text-center text-xs text-indigo-300 font-bold"
        >
          مؤشر كفاءة المحل المباشر
        </div>
      </div>

      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-emerald-300 transition"
      >
        <div class="flex justify-between items-center mb-3">
          <span
            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
          >
            سيولة الخزنة كاش
          </span>
          <span
            class="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-base"
          >
            💰
          </span>
        </div>
        <div>
          <h3 class="text-2xl font-black text-slate-900 font-mono">
            {{ stats.current_drawer }}
            <span class="text-xs font-bold">ج</span>
          </h3>
          <p class="text-[10px] text-emerald-600 font-bold mt-1">
            💵 كاش الدرج الحالي
          </p>
        </div>
        <button
          @click="openDetails('drawer', 'تقرير حركة كاش الخزنة والدرج')"
          class="mt-3 text-center text-xs text-emerald-700 bg-emerald-50 py-1 rounded-lg font-bold hover:bg-emerald-100 transition"
        >
          🔍 مصدر السيولة
        </button>
      </div>

      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-blue-300 transition"
      >
        <div class="flex justify-between items-center mb-3">
          <span
            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
          >
            إجمالي المبيعات
          </span>
          <span class="p-1.5 bg-blue-50 text-blue-600 rounded-lg text-base">
            📈
          </span>
        </div>
        <div>
          <h3 class="text-2xl font-black text-slate-900 font-mono">
            {{ stats.total_sales }}
            <span class="text-xs font-bold">ج</span>
          </h3>
          <p class="text-[10px] text-blue-600 font-bold mt-1">
            🛍️ قيمة الفواتير الصادرة
          </p>
        </div>
        <button
          @click="openDetails('sales', 'سجل فواتير المبيعات الصادرة')"
          class="mt-3 text-center text-xs text-blue-700 bg-blue-50 py-1 rounded-lg font-bold hover:bg-blue-100 transition"
        >
          🔍 عرض الفواتير
        </button>
      </div>

      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-red-300 transition"
      >
        <div class="flex justify-between items-center mb-3">
          <span
            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
          >
            ديون السوق (لنا بره)
          </span>
          <span class="p-1.5 bg-red-50 text-red-600 rounded-lg text-base">
            👤
          </span>
        </div>
        <div>
          <h3 class="text-2xl font-black text-red-600 font-mono">
            {{ stats.clients_debt }}
            <span class="text-xs font-bold">ج</span>
          </h3>
          <p class="text-[10px] text-red-500 font-medium mt-1">
            ⚠️ مديونيات العملاء الجارية
          </p>
        </div>
        <button
          @click="openDetails('clients', 'قائمة العملاء المديونين للشركة')"
          class="mt-3 text-center text-xs text-red-700 bg-red-50 py-1 rounded-lg font-bold hover:bg-red-100 transition"
        >
          🔍 كشف المديونين
        </button>
      </div>

      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-amber-300 transition"
      >
        <div class="flex justify-between items-center mb-3">
          <span
            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
          >
            ديون الشركات (علينا)
          </span>
          <span class="p-1.5 bg-amber-50 text-amber-600 rounded-lg text-base">
            🚚
          </span>
        </div>
        <div>
          <h3 class="text-2xl font-black text-slate-900 font-mono">
            {{ stats.suppliers_debt }}
            <span class="text-xs font-bold">ج</span>
          </h3>
          <p class="text-[10px] text-amber-600 font-medium mt-1">
            💼 مستحقات الشركات الآجلة
          </p>
        </div>
        <button
          @click="openDetails('suppliers', 'قائمة مستحقات الشركات والموردين')"
          class="mt-3 text-center text-xs text-amber-700 bg-amber-50 py-1 rounded-lg font-bold hover:bg-amber-100 transition"
        >
          🔍 عرض الشركات
        </button>
      </div>

      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-purple-300 transition"
      >
        <div class="flex justify-between items-center mb-3">
          <span
            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
          >
            إجمالي المشتريات
          </span>
          <span class="p-1.5 bg-purple-50 text-purple-600 rounded-lg text-base">
            📦
          </span>
        </div>
        <div>
          <h3 class="text-2xl font-black text-slate-900 font-mono">
            {{ stats.total_purchases }}
            <span class="text-xs font-bold">ج</span>
          </h3>
          <p class="text-[10px] text-purple-500 font-medium mt-1">
            📥 بضاعة دخلت المخازن
          </p>
        </div>
        <button
          @click="openDetails('purchases', 'سجل فواتير المشتريات الواردة')"
          class="mt-3 text-center text-xs text-purple-700 bg-purple-50 py-1 rounded-lg font-bold hover:bg-purple-100 transition"
        >
          🔍 سجل المشتريات
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        class="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
      >
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-lg font-bold text-slate-900">
              🚨 نواقص أصناف المخزن الحالي
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">
              الأصناف التي كميتها الجردية تعادل أو تقل عن 5 قطع بالمخازن
            </p>
          </div>
          <span
            class="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-xl animate-pulse"
          >
            {{ stats.low_stock_count }} صنف ناقص
          </span>
        </div>
        <div class="overflow-hidden border border-slate-100 rounded-xl">
          <table class="w-full text-right text-sm">
            <thead class="bg-slate-50 text-slate-500 font-bold">
              <tr>
                <th class="p-3">اسم الصنف المعني</th>
                <th class="p-3 text-center">الكمية الحالية</th>
                <th class="p-3 text-center">سعر البيع</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="prod in stats.low_stock_products"
                :key="prod.id"
                class="hover:bg-slate-50/50 transition"
              >
                <td class="p-3 font-bold text-slate-800">{{ prod.name }}</td>
                <td class="p-3 text-center">
                  <span
                    class="bg-red-100 text-red-700 px-2 py-0.5 rounded-lg text-xs font-black"
                  >
                    {{ prod.stock_quantity }} قطع
                  </span>
                </td>
                <td class="p-3 text-center font-bold text-blue-600 font-mono">
                  {{ prod.sale_price }} ج
                </td>
              </tr>
              <tr v-if="stats.low_stock_products?.length === 0">
                <td
                  colspan="3"
                  class="text-center py-8 text-slate-400 font-medium"
                >
                  ✨ المخزن مالي مركزه بالكامل ولا توجد أي نواقص.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between"
      >
        <div>
          <h2 class="text-lg font-bold text-slate-900 mb-1">
            📦 تنوع وجرد السلع بالمشروع
          </h2>
          <p class="text-xs text-slate-400 mb-6">
            مؤشر سريع لإجمالي عدد السلع النشطة
          </p>
          <div class="space-y-4">
            <div
              class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center"
            >
              <span class="text-sm font-bold text-slate-600">
                إجمالي الأصناف المسجلة:
              </span>
              <span class="text-xl font-black font-mono text-slate-900">
                {{ stats.total_products_count }}
              </span>
            </div>
            <div
              class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center"
            >
              <span class="text-sm font-bold text-slate-600">
                أصناف مؤمنة بالكامل:
              </span>
              <span class="text-xl font-black font-mono text-emerald-600">
                {{ stats.total_products_count - stats.low_stock_count }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="text-center text-xs text-slate-400 font-medium border-t pt-4 mt-6"
        >
          🔒 حماية وتشفير مالي فوري لكافة الحركات الجارية
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-100 max-h-[85vh] flex flex-col overflow-hidden animate-fade-in text-right"
      >
        <div
          class="p-4 bg-slate-900 text-white flex justify-between items-center"
        >
          <div>
            <h3 class="text-lg font-black">{{ modalTitle }}</h3>
            <p class="text-xs text-slate-400 mt-0.5">
              عرض السجلات والبنود الـ 15 الأخيرة لتتبع اللوجيك المالي
            </p>
          </div>
          <button
            @click="showModal = false"
            class="text-slate-400 hover:text-white text-2xl font-bold bg-slate-800 px-3 py-1 rounded-xl transition"
          >
            ✕
          </button>
        </div>

        <div class="p-6 overflow-y-auto bg-slate-50 flex-1">
          <table v-if="modalType === 'drawer'" class="w-full text-sm">
            <thead
              class="bg-slate-200 text-slate-700 font-bold border-b border-slate-300"
            >
              <tr>
                <th class="p-3">التاريخ والوقت</th>
                <th class="p-3 text-center">النوع</th>
                <th class="p-3 text-center">المبلغ</th>
                <th class="p-3">البيان والتوجيه</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr
                v-for="t in stats.lists?.drawer"
                :key="t.date"
                class="hover:bg-white transition"
              >
                <td class="p-3 font-mono text-xs text-slate-500">
                  {{ t.date }}
                </td>
                <td class="p-3 text-center font-bold text-xs">
                  <span
                    :class="
                      t.type.includes('وارد')
                        ? 'bg-green-100 text-green-700 px-2 py-0.5 rounded'
                        : 'bg-orange-100 text-orange-700 px-2 py-0.5 rounded'
                    "
                  >
                    {{ t.type }}
                  </span>
                </td>
                <td class="p-3 text-center font-bold font-mono text-slate-900">
                  {{ t.amount }} ج
                </td>
                <td class="p-3 text-slate-600 font-medium">{{ t.desc }}</td>
              </tr>
            </tbody>
          </table>

          <table
            v-if="modalType === 'sales' || modalType === 'purchases'"
            class="w-full text-sm"
          >
            <thead
              class="bg-slate-200 text-slate-700 font-bold border-b border-slate-300"
            >
              <tr>
                <th class="p-3">رقم الفاتورة</th>
                <th class="p-3">
                  {{ modalType === "sales" ? "اسم العميل" : "اسم المورد" }}
                </th>
                <th class="p-3">التاريخ والوقت</th>
                <th class="p-3 text-center">إجمالي الفاتورة</th>
                <th class="p-3 text-center">المسدد كاش</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr
                v-for="inv in modalType === 'sales'
                  ? stats.lists?.sales
                  : stats.lists?.purchases"
                :key="inv.id"
                class="hover:bg-white transition"
              >
                <td class="p-3 font-mono font-bold text-blue-600">
                  #{{ inv.id }}
                </td>
                <td class="p-3 font-bold text-slate-900">{{ inv.name }}</td>
                <td class="p-3 font-mono text-xs text-slate-500">
                  {{ inv.date }}
                </td>
                <td class="p-3 text-center font-black text-slate-900 font-mono">
                  {{ inv.total }} ج
                </td>
                <td
                  class="p-3 text-center font-bold text-emerald-700 font-mono"
                >
                  {{ inv.paid }} ج
                </td>
              </tr>
            </tbody>
          </table>

          <table
            v-if="modalType === 'clients' || modalType === 'suppliers'"
            class="w-full text-sm"
          >
            <thead
              class="bg-slate-200 text-slate-700 font-bold border-b border-slate-300"
            >
              <tr>
                <th class="p-3">الاسم الكريم</th>
                <th class="p-3">رقم الموبايل</th>
                <th class="p-3 text-center">المديونية الحالية المتبقية</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr
                v-for="person in modalType === 'clients'
                  ? stats.lists?.clients
                  : stats.lists?.suppliers"
                :key="person.name"
                class="hover:bg-white transition"
              >
                <td class="p-3 font-bold text-slate-900">{{ person.name }}</td>
                <td class="p-3 font-mono text-slate-500">{{ person.phone }}</td>
                <td
                  class="p-3 text-center font-black text-red-600 font-mono text-base"
                >
                  {{ person.amount }} ج.م
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="p-3 bg-slate-100 text-left text-xs font-bold text-slate-400 pr-4"
        >
          نظام ERP مالي آمن 100%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const stats = ref({
  total_sales: 0,
  total_purchases: 0,
  current_drawer: 0,
  clients_debt: 0,
  suppliers_debt: 0,
  net_profit: 0,
  total_products_count: 0,
  low_stock_count: 0,
  low_stock_products: [],
  lists: { sales: [], purchases: [], drawer: [], clients: [], suppliers: [] },
});

const currentTime = ref("");
const showModal = ref(false);
const modalType = ref("");
const modalTitle = ref("");

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const fetchDashboardStats = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/dashboard/stats");
    stats.value = res.data.data;
    updateTime();
  } catch (error) {
    console.error("Error loading dashboard metrics:", error);
  }
};

// 🌟 فتح المودال الجوكر وتوجيه البيانات المعنية
const openDetails = (type, title) => {
  modalType.value = type;
  modalTitle.value = title;
  showModal.value = true;
};

onMounted(() => {
  fetchDashboardStats();
  updateTime();
  setInterval(fetchDashboardStats, 30000); // تحديث فوري كل 30 ثانية لأمان الرصد
});
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.animate-pulse {
  animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
