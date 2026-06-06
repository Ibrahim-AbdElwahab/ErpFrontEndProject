<template>
  <div class="p-6 bg-slate-50 min-h-screen" dir="rtl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">إدارة المخزن والأصناف</h1>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm"
      >
        + صنف جديد
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 ابحث عن صنف بالاسم جوه المخزن..."
          class="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <table class="w-full text-right text-sm">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th class="p-4">اسم الصنف</th>
            <th class="p-4">الكمية بالمخزن</th>
            <th class="p-4">سعر الشراء</th>
            <th class="p-4">سعر البيع</th>
            <th class="p-4 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
            class="border-b hover:bg-slate-50 transition"
          >
            <td class="p-4 font-bold text-gray-800">{{ product.name }}</td>
            <td class="p-4 font-bold">
              <span
                :class="
                  product.stock_quantity <= 5
                    ? 'text-red-600 animate-pulse'
                    : 'text-gray-700'
                "
              >
                {{ product.stock_quantity }}
              </span>
              <span
                v-if="product.stock_quantity <= 5"
                class="mr-2 text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-medium"
              >
                ⚠️ قرب يخلص
              </span>
            </td>
            <td class="p-4 font-semibold text-gray-600">
              {{ product.purchase_price }} ج.م
            </td>
            <td class="p-4 font-bold text-blue-600">
              {{ product.sale_price }} ج.م
            </td>
            <td class="p-4 text-center">
              <button
                @click="openEditModal(product)"
                class="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold hover:bg-blue-200 transition"
              >
                ✏️ تعديل الأسعار والجرد
              </button>
            </td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="5" class="text-center py-10 text-gray-400 font-medium">
              مفيش أي أصناف بالاسم ده حالياً!
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl w-96 shadow-2xl">
        <h2 class="text-xl font-bold mb-4 text-gray-800">
          إضافة صنف جديد للمخزن
        </h2>
        <div class="space-y-3">
          <input
            v-model="newProduct.name"
            placeholder="اسم الصنف"
            class="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1">
              اختار الفئة / القسم
            </label>
            <select
              v-model="newProduct.category_id"
              class="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option :value="null" disabled>-- اختار القسم --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <input
            v-model="newProduct.stock_quantity"
            type="number"
            placeholder="الكمية الابتدائية بالمخزن"
            class="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            v-model="newProduct.purchase_price"
            type="number"
            placeholder="سعر الشراء"
            class="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            v-model="newProduct.sale_price"
            type="number"
            placeholder="سعر البيع للمستهلك"
            class="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex gap-2 mt-5">
          <button
            @click="saveProduct"
            :disabled="loading"
            class="bg-blue-600 text-white w-full py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {{ loading ? "جاري الحفظ..." : "حفظ الصنف" }}
          </button>
          <button
            @click="showAddModal = false"
            class="bg-gray-200 text-gray-700 w-full py-2 rounded-lg font-bold hover:bg-gray-300 transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white p-6 rounded-xl w-96 shadow-2xl border border-gray-100"
      >
        <h2 class="text-xl font-bold mb-4 text-gray-800">
          تعديل الصنف: {{ activeProduct?.name }}
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-600 mb-1">
              اسم الصنف الجديد
            </label>
            <input
              v-model="editData.name"
              class="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-600 mb-1">
              القسم / الفئة
            </label>
            <select
              v-model="editData.category_id"
              class="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1">
                سعر الشراء
              </label>
              <input
                v-model="editData.purchase_price"
                type="number"
                class="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-center text-gray-700"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1">
                سعر البيع
              </label>
              <input
                v-model="editData.sale_price"
                type="number"
                class="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-center text-blue-600"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-600 mb-1">
              الكمية الحالية (جرد مباشر)
            </label>
            <input
              v-model="editData.stock_quantity"
              type="number"
              class="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-center text-green-700 bg-green-50/50"
            />
            <p class="text-[10px] text-gray-400 mt-1">
              💡 ملحوظة: تعديل الكمية من هنا بيغير الرصيد فوراً لتصحيح فروق
              الجرد.
            </p>
          </div>
        </div>

        <div class="flex gap-2 mt-6">
          <button
            @click="submitEdit"
            :disabled="loading"
            class="bg-blue-600 text-white w-full py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
          >
            {{ loading ? "جاري التحديث..." : "تحديث البيانات 💾" }}
          </button>
          <button
            @click="showEditModal = false"
            class="bg-gray-200 text-gray-700 w-full py-2.5 rounded-lg font-bold hover:bg-gray-300 transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const products = ref([]);
const categories = ref([]);
const searchQuery = ref("");
const showAddModal = ref(false);
const showEditModal = ref(false);
const loading = ref(false);

const newProduct = ref({
  name: "",
  category_id: null,
  stock_quantity: "",
  purchase_price: "",
  sale_price: "",
});
const activeProduct = ref(null);
const editData = ref({
  name: "",
  category_id: null,
  stock_quantity: "",
  purchase_price: "",
  sale_price: "",
});

const fetchData = async () => {
  try {
    const [prodRes, catRes] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/products"),
      axios.get("http://127.0.0.1:8000/api/categories"),
    ]);
    products.value = prodRes.data.data;
    categories.value = catRes.data.data;
  } catch (error) {
    console.error("Error loading inventory data:", error);
  }
};

const filteredProducts = computed(() => {
  return products.value.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});
const saveProduct = async () => {
  loading.value = true;
  try {
    const payload = {
      name: newProduct.value.name,
      category_id: newProduct.value.category_id,
      purchase_price: newProduct.value.purchase_price,
      sale_price: newProduct.value.sale_price, // ده الاسم اللي الكنترولر فوق هيستقبله ويحوله
      stock_quantity: newProduct.value.stock_quantity || 0,
      barcode: newProduct.value.barcode || null,
    };

    await axios.post("http://127.0.0.1:8000/api/products", payload);

    alert("تم إضافة الصنف بنجاح!");
    showAddModal.value = false;
    fetchData();
  } catch (error) {
    console.error(error.response?.data);
    alert("فشل الحفظ: تأكد من إدخال البيانات بشكل صحيح");
  }
  loading.value = false;
};
onMounted(fetchData);
</script>

<style scoped>
/* إضافة أنيميشن النبض للخلفية في حالة النواقص */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

