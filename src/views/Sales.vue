<template>
  <div>
    <div
      class="print:hidden grid grid-cols-12 gap-6 p-6 bg-slate-50 min-h-screen"
      dir="rtl"
    >
      <div class="col-span-7 flex flex-col space-y-4 h-full">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 ابحث عن صنف لبيعه..."
            class="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        <div
          class="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm p-4 min-h-[500px]"
        >
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              @click="addToCart(product)"
              class="bg-gray-50 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition"
            >
              <h3 class="font-bold text-gray-800 line-clamp-2">
                {{ product.name }}
              </h3>
              <p class="text-xs text-gray-500 mt-1">
                المخزن: {{ product.stock_quantity }} | السعر:
                {{ product.sale_price }} ج
              </p>
            </div>
          </div>
          <div
            v-if="filteredProducts.length === 0"
            class="text-center py-10 text-gray-400"
          >
            مفيش صنف بالاسم ده في المخزن!
          </div>
        </div>
      </div>

      <div
        class="col-span-5 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col h-full min-h-[600px]"
      >
        <div class="p-4 border-b bg-slate-50 rounded-t-xl">
          <label class="block text-sm font-bold text-red-600 mb-2">
            👤 اختار العميل المسجل (إجباري لإتمام البيع) *
          </label>
          <select
            v-model="selectedClient"
            class="w-full border-2 border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
          >
            <option :value="null" disabled>
              -- ⚠️ تنبيه: يجب اختيار عميل مسجل من هنا --
            </option>
            <option
              v-for="client in clients"
              :key="client.id"
              :value="client.id"
            >
              {{ client.name }} (عليه حالياً: {{ Math.abs(client.balance) }} ج)
            </option>
          </select>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          <div
            v-if="cart.length === 0"
            class="text-center py-10 text-gray-400 font-medium"
          >
            🛒 الفاتورة فاضية.. اختار أصناف
          </div>

          <div
            v-for="item in cart"
            :key="item.id"
            class="bg-white p-3 rounded-xl border shadow-sm transition-all duration-200"
            :class="
              item.price < item.purchase_price
                ? 'border-red-300 bg-red-50/40 shadow-inner'
                : 'border-gray-200'
            "
          >
            <div class="flex justify-between items-start mb-2">
              <h4
                class="font-bold text-sm"
                :class="
                  item.price < item.purchase_price
                    ? 'text-red-900'
                    : 'text-gray-800'
                "
              >
                {{ item.name }}
              </h4>
              <button
                @click="removeFromCart(item)"
                class="text-red-400 text-sm hover:text-red-600"
              >
                ✖ حذف
              </button>
            </div>
            <div class="flex gap-4 items-center">
              <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  @click="updateQty(item, -1)"
                  class="w-6 h-6 bg-white font-bold rounded shadow-sm"
                >
                  -
                </button>
                <span class="w-8 text-center font-bold text-sm">
                  {{ item.qty }}
                </span>
                <button
                  @click="updateQty(item, 1)"
                  class="w-6 h-6 bg-white font-bold rounded shadow-sm"
                >
                  +
                </button>
              </div>
              <div class="flex-1">
                <input
                  v-model="item.price"
                  type="number"
                  class="w-full border rounded-lg p-1 text-center font-bold outline-none transition-colors"
                  :class="
                    item.price < item.purchase_price
                      ? 'border-red-400 bg-red-100 text-red-700 focus:ring-2 focus:ring-red-500'
                      : 'border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500'
                  "
                />
              </div>
              <div
                class="font-bold w-20 text-left"
                :class="
                  item.price < item.purchase_price
                    ? 'text-red-700'
                    : 'text-gray-800'
                "
              >
                {{ item.price * item.qty }} ج
              </div>
            </div>

            <div
              v-if="item.price < item.purchase_price"
              class="text-[11px] text-red-600 font-bold mt-2 bg-red-100/50 p-1 rounded border border-red-200/60 flex items-center gap-1"
            >
              ⚠️ إنذار خسارة: تكلفة الصنف {{ item.purchase_price }} ج - أنت تخسر
              {{ item.purchase_price - item.price }} ج في القطعة الواحدة!
            </div>
          </div>
        </div>

        <div class="p-4 border-t bg-white rounded-b-xl space-y-4">
          <div class="flex justify-between text-lg font-bold text-gray-800">
            <span>إجمالي الفاتورة:</span>
            <span>{{ totalAmount }} ج.م</span>
          </div>
          <div>
            <label
              class="block text-sm font-bold text-gray-700 mb-1 text-green-600"
            >
              المدفوع كاش (هيدخل الخزنة)
            </label>
            <input
              v-model="paidAmount"
              type="number"
              class="w-full border-2 border-green-400 rounded-lg p-3 text-center text-xl font-bold outline-none focus:ring-2 focus:ring-green-500 text-green-700"
            />
          </div>
          <button
            @click="submitSale"
            :disabled="cart.length === 0 || loading"
            class="w-full text-white py-4 rounded-xl font-bold text-lg transition shadow-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
          >
            {{ loading ? "جاري الحفظ..." : "حفظ وطباعة الفاتورة 🖨️" }}
          </button>
        </div>
      </div>
    </div>

    <div
      class="hidden print:block w-full bg-white text-slate-800 font-sans p-6"
      dir="rtl"
    >
      <div
        class="flex justify-between items-center border-b pb-6 mb-6 border-slate-300"
      >
        <div>
          <h1 class="text-3xl font-black tracking-tight text-slate-900 mb-1">
            فاتورة مبيعات
          </h1>
          <p class="text-sm text-slate-500 font-medium">
            نظام الإدارة المالي الموحد
          </p>
        </div>
        <div
          class="text-left bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-semibold space-y-1"
        >
          <p class="text-slate-700">
            رقم الفاتورة:
            <span class="font-mono text-sm font-bold text-slate-900">
              #{{ invoiceNumber }}
            </span>
          </p>
          <p class="text-slate-700">
            التاريخ: {{ new Date().toLocaleDateString("ar-EG") }}
          </p>
          <p class="text-slate-700">المستخدم: النظام الإلكتروني</p>
        </div>
      </div>

      <div
        class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex justify-between items-center font-bold text-sm"
      >
        <div class="text-slate-700">
          العميل الفاضل:
          <span class="text-base text-slate-900 pr-1">
            {{ currentClientObj?.name }}
          </span>
        </div>
        <div class="text-slate-700">
          رقم الهاتف:
          <span class="font-mono text-slate-900">
            {{ currentClientObj?.phone || "---" }}
          </span>
        </div>
      </div>

      <table class="w-full border-collapse text-right text-sm mb-6">
        <thead>
          <tr class="border-b-2 border-slate-300 text-slate-500 font-bold">
            <th class="py-3 w-12 text-center">م</th>
            <th class="py-3 pr-2">الوصف / الصنف</th>
            <th class="py-3 text-center w-20">الكمية</th>
            <th class="py-3 text-center w-28">السعر لِلقطعة</th>
            <th class="py-3 text-left w-28 pl-2">الإجمالي</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr
            v-for="(item, index) in cart"
            :key="item.id"
            class="text-slate-700"
          >
            <td class="py-3.5 text-center font-medium text-slate-400">
              {{ index + 1 }}
            </td>
            <td class="py-3.5 pr-2 font-bold text-slate-900">
              {{ item.name }}
            </td>
            <td class="py-3.5 text-center font-semibold">{{ item.qty }}</td>
            <td class="py-3.5 text-center font-semibold">
              {{ item.price }} ج.م
            </td>
            <td class="py-3.5 text-left font-bold text-slate-900 pl-2">
              {{ item.qty * item.price }} ج.م
            </td>
          </tr>
        </tbody>
      </table>

      <div
        class="w-1/2 mr-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-sm font-bold mb-8"
      >
        <div class="flex justify-between text-slate-500">
          <span>عدد الأصناف المبيعة:</span>
          <span class="font-mono text-slate-800 text-base">
            {{ cart.length }}
          </span>
        </div>
        <div
          class="flex justify-between text-slate-700 border-t border-slate-200 pt-2"
        >
          <span>إجمالي الفاتورة الحالي:</span>
          <span class="text-slate-900">{{ totalAmount }} ج.م</span>
        </div>
        <div class="flex justify-between text-slate-500">
          <span>الحساب الآجل السابق:</span>
          <span class="text-red-600 font-mono">{{ previousBalance }} ج.م</span>
        </div>
        <div
          class="flex justify-between text-emerald-700 bg-emerald-50/50 p-1.5 rounded-lg"
        >
          <span>المسدد كاش (نقداً):</span>
          <span>{{ paidAmount }} ج.م</span>
        </div>
        <div
          class="flex justify-between text-slate-900 border-t-2 border-slate-300 pt-2.5 text-base"
        >
          <span>الرصيد الإجمالي المستحق:</span>
          <span class="text-xl font-black text-slate-900 font-mono">
            {{ currentRunningBalance }} ج.m
          </span>
        </div>
      </div>

      <div
        class="border border-slate-200 rounded-xl p-4 text-center text-slate-500 font-medium text-xs leading-relaxed max-w-2xl mx-auto"
      >
        <p class="font-bold text-slate-700 mb-1">📌 ملاحظات إدارية:</p>
        <p>
          تُعتبر هذه الفاتورة وثيقة رسمية لتأكيد التعامل الجاري وصحة الأرصدة
          المذكورة أعلاه.
        </p>
        <p>
          الرجاء مراجعة الأصناف المستلمة فوراً، وشاكرين جداً لثقتكم بنا
          وبخدماتنا.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const products = ref([]);
const clients = ref([]);
const cart = ref([]);
const searchQuery = ref("");
const selectedClient = ref(null);
const paidAmount = ref(0);
const loading = ref(false);
const invoiceNumber = ref("");

const currentClientObj = computed(() =>
  clients.value.find((c) => c.id === selectedClient.value),
);
const previousBalance = computed(() => {
  if (!currentClientObj.value) return 0;
  return Math.abs(currentClientObj.value.balance);
});
const currentRunningBalance = computed(() => {
  return previousBalance.value + totalAmount.value - paidAmount.value;
});

const fetchData = async () => {
  try {
    const [prodRes, cliRes] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/products"),
      axios.get("http://127.0.0.1:8000/api/clients"),
    ]);
    products.value = prodRes.data.data;
    clients.value = cliRes.data.data;
  } catch (error) {
    console.error("Error fetching sales data", error);
  }
};

const filteredProducts = computed(() =>
  products.value.filter((p) => p.name.includes(searchQuery.value)),
);
const totalAmount = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.qty, 0),
);

const addToCart = (product) => {
  const item = cart.value.find((i) => i.id === product.id);
  if (item) item.qty++;
  else cart.value.push({ ...product, qty: 1, price: product.sale_price });
};

const updateQty = (item, change) => {
  if (change > 0) item.qty++;
  else if (change < 0 && item.qty > 1) item.qty--;
};

const removeFromCart = (item) =>
  (cart.value = cart.value.filter((i) => i.id !== item.id));

const submitSale = async () => {
  loading.value = true;

  // 🛑 1. الحماية الكبرى الأولى: فرملة عملية الحفظ فوراً لو مفيش عميل محدد
  if (!selectedClient.value) {
    alert(
      "⚠️ خطأ إداري ومحاسبي: البيع الطياري ممنوع تماماً في النظام لحماية أرصدة الحسابات! الرجاء اختيار عميل مسجل لإتمام حفظ الفاتورة.",
    );
    loading.value = false;
    return;
  }

  // 🌟 2. الحماية المحاسبية الثانية: التنبيه في حالة البيع بالخسارة
  const hasLossItems = cart.value.some(
    (item) => parseFloat(item.price) < parseFloat(item.purchase_price),
  );
  if (hasLossItems) {
    const confirmLoss = confirm(
      "⚠️ انتبه يا هندسة: الفاتورة دي فيها أصناف بتتباع بأقل من سعر تكلفتها (خسارة)! هل أنت متأكد وعايز تكمل عملية البيع دي؟",
    );
    if (!confirmLoss) {
      loading.value = false;
      return;
    }
  }

  try {
    const payload = {
      client_id: selectedClient.value,
      paid_amount: paidAmount.value,
      items: cart.value.map((i) => ({
        product_id: i.id,
        quantity: i.qty,
        price: i.price,
      })),
    };

    await axios.post("http://127.0.0.1:8000/api/sales", payload);
    invoiceNumber.value = Math.floor(1000 + Math.random() * 9000).toString();

    setTimeout(() => {
      window.print();
      cart.value = [];
      selectedClient.value = null;
      paidAmount.value = 0;
      fetchData();
    }, 300);
  } catch (error) {
    alert("حصل خطأ أثناء حفظ الفاتورة بالسيستم");
  }
  loading.value = false;
};

onMounted(fetchData);
</script>

<style scoped>
@media print {
  @page {
    margin: 15mm 12mm;
    size: A4 portrait;
  }
  body {
    background: white !important;
    color: #1e293b !important;
    -webkit-print-color-adjust: exact;
  }
}
</style>
