<template>
  <div>
    <!-- ========================================== -->
    <!-- 🖥️ واجهة البرنامج العادية (بتختفي وقت الطباعة) -->
    <!-- ========================================== -->
    <div
      class="print:hidden grid grid-cols-12 gap-6 p-6 bg-slate-50 min-h-screen"
    >
      <!-- الجزء اليمين: المنتجات للبحث والإضافة -->
      <div class="col-span-7 flex flex-col space-y-4 h-full">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="🔍 ابحث عن الصنف اللي هترجعه..."
              class="w-full border border-gray-300 rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
        </div>

        <div
          class="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 min-h-[500px]"
        >
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              @click="addToCart(product)"
              class="bg-gray-50 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition group"
            >
              <h3
                class="font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2"
              >
                {{ product.name }}
              </h3>
              <p class="text-xs text-gray-500 mt-1">
                بالمخزن حالياً: {{ product.stock_quantity }}
              </p>
            </div>
          </div>
          <div
            v-if="filteredProducts.length === 0"
            class="text-center py-10 text-gray-400"
          >
            مفيش صنف بالاسم ده!
          </div>
        </div>
      </div>

      <!-- الجزء الشمال: فاتورة المرتجع -->
      <div
        class="col-span-5 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col h-full min-h-[600px]"
      >
        <!-- إعدادات المرتجع (نوعه والشخص) -->
        <div class="p-4 border-b bg-slate-50 rounded-t-xl space-y-4">
          <div class="flex gap-4">
            <label class="flex-1 cursor-pointer">
              <input
                type="radio"
                v-model="returnType"
                value="client"
                class="peer hidden"
                @change="selectedTarget = null"
              />
              <div
                class="text-center p-2 rounded-lg border-2 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 font-bold text-gray-500 border-gray-200"
              >
                🔄 مرتجع من عميل
              </div>
            </label>
            <label class="flex-1 cursor-pointer">
              <input
                type="radio"
                v-model="returnType"
                value="supplier"
                class="peer hidden"
                @change="selectedTarget = null"
              />
              <div
                class="text-center p-2 rounded-lg border-2 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 font-bold text-gray-500 border-gray-200"
              >
                🔙 مرتجع لمورد
              </div>
            </label>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              {{
                returnType === "client"
                  ? "👤 اختار العميل (اختياري)"
                  : "🚚 اختار المورد (اختياري)"
              }}
            </label>
            <select
              v-model="selectedTarget"
              class="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="null">-- مرتجع نقدي طياري --</option>
              <option
                v-if="returnType === 'client'"
                v-for="client in clients"
                :key="client.id"
                :value="client.id"
              >
                {{ client.name }} (عليه: {{ Math.abs(client.balance) }} ج)
              </option>
              <option
                v-if="returnType === 'supplier'"
                v-for="supplier in suppliers"
                :key="supplier.id"
                :value="supplier.id"
              >
                {{ supplier.name }} (ليه: {{ Math.abs(supplier.balance) }} ج)
              </option>
            </select>
          </div>
        </div>

        <!-- أصناف المرتجع -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          <div
            v-if="cart.length === 0"
            class="text-center py-10 text-gray-400 font-medium"
          >
            🛒 فاتورة المرتجع فاضية.. اختار أصناف
          </div>

          <div
            v-for="item in cart"
            :key="item.id"
            class="bg-white p-3 rounded-xl border border-gray-200 shadow-sm"
          >
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-bold text-sm text-gray-800">{{ item.name }}</h4>
              <button
                @click="removeFromCart(item)"
                class="text-red-400 hover:text-red-600 text-sm"
              >
                ✖ حذف
              </button>
            </div>

            <div class="flex gap-4 items-center">
              <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  @click="updateQty(item, -1)"
                  class="w-6 h-6 bg-white rounded text-gray-600 font-bold"
                >
                  -
                </button>
                <span class="w-8 text-center font-bold text-sm">
                  {{ item.qty }}
                </span>
                <button
                  @click="updateQty(item, 1)"
                  class="w-6 h-6 bg-white rounded text-gray-600 font-bold"
                >
                  +
                </button>
              </div>

              <div class="flex-1">
                <input
                  v-model="item.price"
                  type="number"
                  class="w-full border border-gray-300 rounded-lg p-1 text-center font-bold text-blue-600 outline-none"
                  placeholder="السعر"
                />
              </div>

              <div class="font-bold text-gray-800 w-20 text-left">
                {{ item.price * item.qty }} ج
              </div>
            </div>
          </div>
        </div>

        <!-- الإجماليات والدفع -->
        <div class="p-4 border-t bg-white rounded-b-xl space-y-4">
          <div class="flex justify-between text-lg font-bold text-gray-800">
            <span>إجمالي المرتجع:</span>
            <span>{{ totalAmount }} ج.م</span>
          </div>

          <div>
            <label
              class="block text-sm font-bold text-gray-700 mb-1"
              :class="
                returnType === 'client' ? 'text-red-600' : 'text-green-600'
              "
            >
              {{
                returnType === "client"
                  ? "المدفوع كاش للعميل (هيخرج من الخزنة)"
                  : "المسترد كاش من المورد (هيدخل الخزنة)"
              }}
            </label>
            <input
              v-model="paidAmount"
              type="number"
              class="w-full border-2 rounded-lg p-3 text-center text-xl font-bold outline-none"
              :class="
                returnType === 'client'
                  ? 'border-red-400 focus:ring-red-500 text-red-700'
                  : 'border-green-400 focus:ring-green-500 text-green-700'
              "
            />
          </div>

          <button
            @click="submitReturn"
            :disabled="cart.length === 0 || loading"
            class="w-full text-white py-4 rounded-xl font-bold text-lg transition shadow-lg"
            :class="
              returnType === 'client'
                ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300'
                : 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
            "
          >
            {{ loading ? "جاري الحفظ..." : "حفظ وطباعة المرتجع 🖨️" }}
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 🖨️ ريسيت الطباعة المخفي (بيظهر وقت الطباعة بس) -->
    <!-- ========================================== -->
    <div
      class="hidden print:block print:w-[80mm] print:mx-auto bg-white text-black p-4 font-sans"
      dir="rtl"
    >
      <div class="text-center border-b-2 border-gray-800 pb-3 mb-3">
        <h2 class="text-2xl font-black mb-1">اسم محلك / شركتك</h2>
        <p class="text-sm font-bold">رقم التليفون: 01000000000</p>
        <p
          class="text-sm font-bold mt-2 bg-gray-200 inline-block px-2 py-1 rounded"
        >
          {{
            returnType === "client"
              ? "فاتورة مرتجع مبيعات"
              : "فاتورة مرتجع مشتريات"
          }}
        </p>
        <p class="text-xs mt-1">
          التاريخ: {{ new Date().toLocaleString("ar-EG") }}
        </p>
      </div>

      <table
        class="w-full text-right text-sm mb-3 border-b-2 border-gray-800 pb-3"
      >
        <thead>
          <tr class="border-b border-gray-400 font-bold">
            <th class="py-1">الصنف</th>
            <th class="py-1">الكمية</th>
            <th class="py-1">السعر</th>
            <th class="py-1">إجمالي</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in cart"
            :key="item.id"
            class="border-b border-gray-200 border-dashed"
          >
            <td class="py-1">{{ item.name }}</td>
            <td class="py-1">{{ item.qty }}</td>
            <td class="py-1">{{ item.price }}</td>
            <td class="py-1">{{ item.price * item.qty }}</td>
          </tr>
        </tbody>
      </table>

      <div
        class="text-sm font-bold space-y-1 border-b-2 border-gray-800 pb-3 mb-3"
      >
        <div class="flex justify-between text-lg">
          <span>إجمالي المرتجع:</span>
          <span>{{ totalAmount }} ج.م</span>
        </div>
        <div class="flex justify-between">
          <span>
            {{ returnType === "client" ? "كاش للعميل:" : "كاش من المورد:" }}
          </span>
          <span>{{ paidAmount }} ج.م</span>
        </div>
      </div>

      <div class="text-center text-xs font-bold">
        <p>نظام الإدارة الشامل</p>
        <p>--- شكراً لتعاملكم معنا ---</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const returnType = ref("client");
const selectedTarget = ref(null);
const products = ref([]);
const clients = ref([]);
const suppliers = ref([]);
const cart = ref([]);
const searchQuery = ref("");
const paidAmount = ref(0);
const loading = ref(false);

const fetchData = async () => {
  try {
    const [prodRes, cliRes, supRes] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/products"),
      axios.get("http://127.0.0.1:8000/api/clients"),
      axios.get("http://127.0.0.1:8000/api/suppliers"),
    ]);
    products.value = prodRes.data.data;
    clients.value = cliRes.data.data;
    suppliers.value = supRes.data.data;
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

const filteredProducts = computed(() => {
  return products.value.filter((p) => p.name.includes(searchQuery.value));
});

const totalAmount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.qty, 0);
});

const addToCart = (product) => {
  const item = cart.value.find((i) => i.id === product.id);
  if (item) {
    item.qty++;
  } else {
    const defaultPrice =
      returnType.value === "client"
        ? product.sale_price
        : product.purchase_price;
    cart.value.push({ ...product, qty: 1, price: defaultPrice });
  }
};

const updateQty = (item, change) => {
  if (change > 0) item.qty++;
  else if (change < 0 && item.qty > 1) item.qty--;
};

const removeFromCart = (item) => {
  cart.value = cart.value.filter((i) => i.id !== item.id);
};

const submitReturn = async () => {
  loading.value = true;
  try {
    const data = {
      type: returnType.value,
      target_id: selectedTarget.value,
      paid_amount: paidAmount.value,
      items: cart.value.map((i) => ({
        product_id: i.id,
        quantity: i.qty,
        price: i.price,
      })),
    };

    await axios.post("http://127.0.0.1:8000/api/returns", data);

    // 🖨️ هنا سحر الطباعة الأوتوماتيك أول ما يحفظ
    window.print();

    cart.value = [];
    selectedTarget.value = null;
    paidAmount.value = 0;
    fetchData();
  } catch (error) {
    alert("خطأ في حفظ المرتجع، راجع الكونسول");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
/* 🖨️ تظبيط أبعاد مكنة الكاشير 8 سم */
@media print {
  @page {
    margin: 0;
    size: 80mm auto;
  }
  body {
    background: white !important;
  }
}
</style>
