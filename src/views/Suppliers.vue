<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="print:hidden">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">دفتر الموردين والشركات</h1>
        <div class="flex gap-2">
          <button
            @click="window.print()"
            class="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold"
          >
            🖨️ طباعة الدفتر
          </button>
          <button
            @click="showAddModal = true"
            class="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            + مورد جديد
          </button>
        </div>
      </div>

      <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <table class="w-full text-right text-sm">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="p-4">الاسم</th>
              <th class="p-4">الموبايل</th>
              <th class="p-4">المديونية (علينا ليه)</th>
              <th class="p-4 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="supplier in suppliers"
              :key="supplier.id"
              class="border-b"
            >
              <td class="p-4 font-bold">{{ supplier.name }}</td>
              <td class="p-4">{{ supplier.phone || "-" }}</td>
              <td
                class="p-4 font-bold"
                :class="
                  supplier.balance > 0 ? 'text-red-600' : 'text-green-600'
                "
              >
                {{ Math.abs(supplier.balance) }} ج.م
                {{
                  supplier.balance > 0
                    ? "(ليه)"
                    : supplier.balance < 0
                      ? "(رصيد مقدم لِنا)"
                      : "خالص"
                }}
              </td>
              <td class="p-4 flex gap-2 justify-center">
                <button
                  @click="openEditModal(supplier)"
                  class="bg-blue-100 text-blue-700 px-3 py-1 rounded font-bold hover:bg-blue-200"
                >
                  ✏️ تعديل
                </button>
                <button
                  @click="openPayModal(supplier)"
                  class="bg-orange-100 text-orange-700 px-3 py-1 rounded font-bold hover:bg-orange-200"
                >
                  💸 صرف دفعة
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      class="hidden print:block w-full bg-white text-black font-sans"
      dir="rtl"
    >
      <h2 class="text-2xl font-black text-center mb-4">
        كشف إجمالي ديون الموردين
      </h2>
      <table
        class="w-full text-right text-sm border-collapse border border-gray-400"
      >
        <thead>
          <tr class="bg-gray-200 border-b border-gray-400">
            <th class="p-2 border">الاسم</th>
            <th class="p-2 border">الموبايل</th>
            <th class="p-2 border">الرصيد</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="supplier in suppliers"
            :key="supplier.id"
            class="border-b border-gray-400"
          >
            <td class="p-2 border">{{ supplier.name }}</td>
            <td class="p-2 border">{{ supplier.phone }}</td>
            <td class="p-2 border font-bold">{{ supplier.balance }} ج.م</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="printReceiptData"
      class="hidden print:block print:w-[80mm] print:mx-auto bg-white text-black p-4 font-sans text-center mt-10"
      dir="rtl"
    >
      <div class="border-b-2 border-gray-800 pb-3 mb-4">
        <h2 class="text-2xl font-black mb-1">نظام الإدارة الشامل</h2>
        <h3
          class="text-lg font-bold border border-gray-800 inline-block px-3 py-1 mt-2"
        >
          إيصال صرف نقدية
        </h3>
      </div>
      <div class="text-right text-sm font-bold space-y-3 mb-6">
        <p>التاريخ: {{ new Date().toLocaleString("ar-EG") }}</p>
        <p>
          صرفنا لشركة/السيد:
          <span class="text-lg">{{ printReceiptData.name }}</span>
        </p>
        <p>
          مبلغ وقدره:
          <span class="text-xl bg-gray-200 px-2">
            {{ printReceiptData.amount }} ج.م
          </span>
        </p>
        <p>وذلك قيمة: دفعة مسددة من الحساب.</p>
      </div>
      <div
        class="flex justify-between text-xs font-bold mt-8 border-t border-gray-800 pt-2"
      >
        <span>توقيع الكاشير</span>
        <span>توقيع المورد</span>
      </div>
    </div>

    <div
      v-if="showAddModal"
      class="print:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl w-96">
        <h2 class="text-xl font-bold mb-4">إضافة مورد جديد</h2>
        <input
          v-model="newSupplier.name"
          placeholder="اسم المورد"
          class="w-full border p-2 rounded mb-3"
        />
        <input
          v-model="newSupplier.phone"
          placeholder="رقم التليفون"
          class="w-full border p-2 rounded mb-3"
        />
        <input
          v-model="newSupplier.balance"
          type="number"
          placeholder="الرصيد الافتتاحي (بالموجب لو ليه فلوس)"
          class="w-full border p-2 rounded mb-4"
        />
        <div class="flex gap-2">
          <button
            @click="saveSupplier"
            class="bg-purple-600 text-white w-full py-2 rounded"
          >
            حفظ
          </button>
          <button
            @click="showAddModal = false"
            class="bg-gray-200 w-full py-2 rounded"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showPayModal"
      class="print:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl w-96">
        <h2 class="text-xl font-bold mb-4">
          صرف دفعة لـ: {{ activeSupplier?.name }}
        </h2>
        <input
          v-model="payAmount"
          type="number"
          placeholder="المبلغ"
          class="w-full border-2 border-orange-400 p-3 text-xl font-bold text-center rounded mb-4 outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div class="flex gap-2">
          <button
            @click="submitPayment"
            :disabled="loading"
            class="bg-orange-600 text-white w-full py-2 rounded font-bold"
          >
            حفظ وطباعة إيصال 🖨️
          </button>
          <button
            @click="showPayModal = false"
            class="bg-gray-200 w-full py-2 rounded"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showEditModal"
      class="print:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl w-[32rem]">
        <h2 class="text-xl font-bold mb-4">
          تعديل بيانات المورد: {{ activeSupplier?.name }}
        </h2>

        <div class="space-y-3 mb-4">
          <input
            v-model="editData.name"
            placeholder="اسم المورد / الشركة"
            class="w-full border p-2 rounded focus:ring-2 outline-none"
          />
          <input
            v-model="editData.phone"
            placeholder="رقم التليفون"
            class="w-full border p-2 rounded focus:ring-2 outline-none"
          />
        </div>

        <div
          class="border-t border-gray-200 pt-4 mb-4 bg-slate-50 p-4 rounded-lg shadow-inner"
        >
          <h3 class="font-bold text-sm text-gray-700 mb-3">
            إشعارات التسوية المالية للمورد (تعديل الحساب بدون كاش)
          </h3>
          <div class="flex flex-wrap gap-2 mb-2">
            <select
              v-model="editData.adjustment_type"
              class="border p-2 rounded flex-1 font-bold outline-none"
              :class="
                editData.adjustment_type === 'discount'
                  ? 'text-green-600'
                  : editData.adjustment_type === 'addition'
                    ? 'text-red-600'
                    : ''
              "
            >
              <option value="">-- بدون تسوية --</option>
              <option value="discount">
                📉 إشعار خصم مكسوب (تقليل فلوس المورد علينا)
              </option>
              <option value="addition">
                📈 إشعار إضافة مديونية (تزويد فلوس المورد علينا)
              </option>
            </select>
            <input
              v-if="editData.adjustment_type"
              v-model="editData.adjustment_amount"
              type="number"
              placeholder="المبلغ"
              class="w-1/3 border p-2 rounded outline-none font-bold"
            />
          </div>
          <input
            v-if="editData.adjustment_type"
            v-model="editData.adjustment_note"
            placeholder="سبب التسوية (مثال: خصم خاص، فرق سعر شحن...)"
            class="w-full border p-2 rounded text-sm mt-2 outline-none"
          />
        </div>

        <div class="flex gap-2">
          <button
            @click="submitEdit"
            :disabled="loading"
            class="bg-blue-600 text-white w-full py-2 rounded font-bold hover:bg-blue-700"
          >
            {{ loading ? "جاري الحفظ..." : "حفظ التعديلات" }}
          </button>
          <button
            @click="showEditModal = false"
            class="bg-gray-200 text-gray-800 w-full py-2 rounded font-bold hover:bg-gray-300"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const suppliers = ref([]);
const showAddModal = ref(false);
const showPayModal = ref(false);
const showEditModal = ref(false);

const newSupplier = ref({ name: "", phone: "", balance: 0 });
const activeSupplier = ref(null);
const payAmount = ref("");
const loading = ref(false);
const printReceiptData = ref(null);

const editData = ref({
  name: "",
  phone: "",
  adjustment_type: "",
  adjustment_amount: "",
  adjustment_note: "",
});

const fetchSuppliers = async () => {
  const res = await axios.get("http://127.0.0.1:8000/api/suppliers");
  suppliers.value = res.data.data;
};

const saveSupplier = async () => {
  await axios.post("http://127.0.0.1:8000/api/suppliers", newSupplier.value);
  showAddModal.value = false;
  newSupplier.value = { name: "", phone: "", balance: 0 };
  fetchSuppliers();
};

const openPayModal = (supplier) => {
  activeSupplier.value = supplier;
  showPayModal.value = true;
};

const submitPayment = async () => {
  loading.value = true;
  try {
    await axios.post(
      `http://127.0.0.1:8000/api/suppliers/${activeSupplier.value.id}/pay`,
      { amount: payAmount.value },
    );
    printReceiptData.value = {
      name: activeSupplier.value.name,
      amount: payAmount.value,
    };
    setTimeout(() => {
      window.print();
      showPayModal.value = false;
      payAmount.value = "";
      printReceiptData.value = null;
      fetchSuppliers();
    }, 500);
  } catch (error) {
    alert("خطأ في التسجيل");
  }
  loading.value = false;
};

// 🌟 فتح مودال تعديل المورد
const openEditModal = (supplier) => {
  activeSupplier.value = supplier;
  editData.value = {
    name: supplier.name,
    phone: supplier.phone || "",
    adjustment_type: "",
    adjustment_amount: "",
    adjustment_note: "",
  };
  showEditModal.value = true;
};

// 🌟 حفظ تعديل وتسوية المورد
const submitEdit = async () => {
  loading.value = true;
  try {
    await axios.put(
      `http://127.0.0.1:8000/api/suppliers/${activeSupplier.value.id}`,
      editData.value,
    );
    showEditModal.value = false;
    fetchSuppliers();
  } catch (error) {
    alert("حصل خطأ في التعديل");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSuppliers);
</script>

<style scoped>
@media print {
  @page {
    margin: 1cm;
  }
  body {
    background: white !important;
  }
}
</style>
