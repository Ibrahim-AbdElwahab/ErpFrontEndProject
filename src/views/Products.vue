<template>
  <div class="p-6 bg-slate-50 min-h-screen" dir="rtl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-black text-slate-900">إدارة الأصناف والمخزن</h1>
      <button
        @click="openAddModal"
        class="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md"
      >
        + إضافة صنف جديد
      </button>
    </div>

    <div
      class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <table class="w-full text-right text-sm">
        <thead
          class="bg-slate-100 text-slate-600 font-bold border-b border-slate-200"
        >
          <tr>
            <th class="p-4">اسم الصنف</th>
            <th class="p-4 text-center">الكمية بالمخزن</th>
            <th class="p-4 text-center">سعر الشراء</th>
            <th class="p-4 text-center">سعر البيع</th>
            <th class="p-4 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="product in products"
            :key="product.id"
            class="hover:bg-slate-50 transition"
          >
            <td class="p-4 font-bold text-slate-800">{{ product.name }}</td>
            <td
              class="p-4 text-center font-bold"
              :class="
                product.stock_quantity <= 5
                  ? 'text-red-600'
                  : 'text-emerald-600'
              "
            >
              {{ product.stock_quantity }}
            </td>
            <td class="p-4 text-center font-mono text-slate-600">
              {{ product.purchase_price }} ج
            </td>
            <td class="p-4 text-center font-mono font-bold text-blue-600">
              {{ product.selling_price }} ج
            </td>

            <td class="p-4 text-center space-x-3 space-x-reverse">
              <button
                @click="openEditModal(product)"
                class="text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg font-bold hover:bg-amber-100 transition"
              >
                ✏️ تعديل
              </button>
              <button
                @click="deleteProduct(product.id)"
                class="text-red-600 bg-red-50 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100 transition"
              >
                🗑️ حذف
              </button>
            </td>
          </tr>
          <tr v-if="products.length === 0">
            <td colspan="5" class="p-10 text-center text-slate-400 font-medium">
              لا توجد أصناف مسجلة حتى الآن.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100"
      >
        <h2 class="text-xl font-black mb-5 text-slate-900">
          {{ isEditing ? "تعديل بيانات الصنف" : "إضافة صنف جديد" }}
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">
              اسم الصنف
            </label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border-2 border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">
              رقم القسم (Category ID)
            </label>
            <input
              v-model="form.category_id"
              type="number"
              class="w-full border-2 border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-mono"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">
                سعر الشراء (التكلفة)
              </label>
              <input
                v-model="form.purchase_price"
                type="number"
                class="w-full border-2 border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">
                سعر البيع
              </label>
              <input
                v-model="form.sale_price"
                type="number"
                class="w-full border-2 border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">
              الكمية الافتتاحية / الحالية
            </label>
            <input
              v-model="form.stock_quantity"
              type="number"
              class="w-full border-2 border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-8">
          <button
            @click="showModal = false"
            class="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
          >
            إلغاء
          </button>
          <button
            @click="submitForm"
            :disabled="loading"
            class="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {{
              loading
                ? "جاري الحفظ..."
                : isEditing
                  ? "حفظ التعديلات"
                  : "حفظ الصنف"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const products = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const currentEditId = ref(null);
const loading = ref(false);

const form = ref({
  name: "",
  category_id: 1,
  purchase_price: "",
  sale_price: "",
  stock_quantity: 0,
});

// سحب البيانات
const fetchData = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/products");
    products.value = response.data.data || [];
  } catch (error) {
    console.error("خطأ في جلب الأصناف:", error);
  }
};

// فتح مودال الإضافة
const openAddModal = () => {
  isEditing.value = false;
  currentEditId.value = null;
  form.value = {
    name: "",
    category_id: 1,
    purchase_price: "",
    sale_price: "",
    stock_quantity: 0,
  };
  showModal.value = true;
};

// فتح مودال التعديل وتعبئة البيانات
const openEditModal = (product) => {
  isEditing.value = true;
  currentEditId.value = product.id;
  form.value = {
    name: product.name,
    category_id: product.category_id,
    purchase_price: product.purchase_price,
    sale_price: product.selling_price, // سحب سعر البيع الحالي
    stock_quantity: product.stock_quantity,
  };
  showModal.value = true;
};

// دالة الحفظ (بتفرق بين الإضافة والتعديل أوتوماتيك)
const submitForm = async () => {
  loading.value = true;
  try {
    const payload = {
      name: form.value.name,
      category_id: form.value.category_id,
      purchase_price: form.value.purchase_price,
      sale_price: form.value.sale_price,
      stock_quantity: form.value.stock_quantity || 0,
    };

    if (isEditing.value) {
      // إرسال طلب التعديل (PUT)
      await axios.put(
        `http://127.0.0.1:8000/api/products/${currentEditId.value}`,
        payload,
      );
    } else {
      // إرسال طلب الإضافة (POST)
      await axios.post("http://127.0.0.1:8000/api/products", payload);
    }

    showModal.value = false;
    await fetchData(); // تحديث الجدول
  } catch (error) {
    console.error(error);
    alert("حدث خطأ! تأكد من صحة البيانات.");
  }
  loading.value = false;
};

// دالة الحذف
const deleteProduct = async (id) => {
  if (confirm("هل أنت متأكد من حذف هذا الصنف نهائياً؟ ⚠️")) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
      await fetchData(); // تحديث الجدول بعد الحذف
    } catch (error) {
      console.error(error);
      alert("لا يمكن حذف الصنف! قد يكون مرتبطاً بفواتير سابقة.");
    }
  }
};

onMounted(fetchData);
</script>
