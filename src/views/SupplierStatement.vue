<template>
  <div class="p-6 bg-slate-50 min-h-screen" dir="rtl">
    <div
      class="mb-8 print:hidden flex justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div class="w-1/3">
        <label class="block text-sm font-bold text-gray-700 mb-2">
          🏢 اختار المورد لعرض كشف الحساب
        </label>
        <select
          v-model="selectedSupplier"
          @change="fetchStatement"
          class="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
        >
          <option :value="null" disabled>-- حدد المورد --</option>
          <option
            v-for="supplier in suppliers"
            :key="supplier.id"
            :value="supplier.id"
          >
            {{ supplier.name }}
          </option>
        </select>
      </div>

      <button
        v-if="statementData.length > 0"
        @click="printStatement"
        class="bg-indigo-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-900 transition flex items-center gap-2 shadow-md"
      >
        🖨️ طباعة كشف الحساب
      </button>
    </div>

    <div
      v-if="loading"
      class="text-center py-20 text-xl font-bold text-gray-500"
    >
      ⏳ جاري تجميع حسابات المورد...
    </div>

    <div
      v-if="!loading && statementData.length > 0"
      class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 print:shadow-none print:border-none print:p-0"
    >
      <div class="text-center mb-8 border-b-2 border-indigo-800 pb-6">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-2">
          كشف حساب مورد
        </h1>
        <p class="text-lg text-gray-600">
          شركة/
          <span class="font-bold text-gray-900">{{ supplierName }}</span>
        </p>
        <p class="text-md text-gray-500 mt-1">
          تاريخ استخراج الكشف: {{ new Date().toLocaleDateString("ar-EG") }}
        </p>
      </div>

      <div
        class="flex justify-between items-center mb-6 bg-indigo-50 p-4 rounded-xl print:bg-transparent print:border print:border-gray-300"
      >
        <h3 class="text-xl font-bold text-gray-800">الرصيد الحالي للمورد:</h3>
        <span
          class="text-2xl font-black"
          :class="currentBalance < 0 ? 'text-red-600' : 'text-green-600'"
        >
          {{ Math.abs(currentBalance) }} ج.م
          <span class="text-sm font-normal">
            {{
              currentBalance < 0
                ? "(مديونيتنا ليه)"
                : currentBalance > 0
                  ? "(دفعناله بزيادة)"
                  : "(خالص)"
            }}
          </span>
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-right border-collapse">
          <thead>
            <tr
              class="bg-indigo-800 text-white print:bg-gray-200 print:text-black"
            >
              <th class="p-3 border border-gray-300">التاريخ</th>
              <th class="p-3 border border-gray-300">نوع الحركة</th>
              <th class="p-3 border border-gray-300 w-1/3">البيان</th>
              <th class="p-3 border border-gray-300 text-center">
                مدين (سددناله)
              </th>
              <th class="p-3 border border-gray-300 text-center">
                دائن (اشترينا منه)
              </th>
              <th class="p-3 border border-gray-300 text-center">الرصيد</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in statementData"
              :key="index"
              @dblclick="showInvoiceDetails(row)"
              class="hover:bg-indigo-50 cursor-pointer transition border-b border-gray-200"
              title="اضغط مرتين لعرض تفاصيل الفاتورة"
            >
              <td
                class="p-3 border border-gray-300 text-sm text-gray-600 whitespace-nowrap"
              >
                {{ row.date }}
              </td>
              <td class="p-3 border border-gray-300 font-bold">
                <span
                  :class="
                    row.type.includes('سداد')
                      ? 'text-green-600'
                      : 'text-orange-600'
                  "
                >
                  {{ row.type }}
                </span>
              </td>
              <td class="p-3 border border-gray-300 text-sm">
                {{ row.description }}
              </td>
              <td
                class="p-3 border border-gray-300 text-center font-bold text-green-600"
              >
                {{ row.debit > 0 ? row.debit : "-" }}
              </td>
              <td
                class="p-3 border border-gray-300 text-center font-bold text-red-600"
              >
                {{ row.credit > 0 ? row.credit : "-" }}
              </td>
              <td
                class="p-3 border border-gray-300 text-center font-black bg-slate-50 print:bg-transparent"
              >
                <span
                  :class="row.balance < 0 ? 'text-red-700' : 'text-green-700'"
                >
                  {{ Math.abs(row.balance) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="!loading && selectedSupplier && statementData.length === 0"
      class="text-center py-20 bg-white rounded-2xl border shadow-sm"
    >
      <span class="text-4xl mb-4 block">📭</span>
      <h3 class="text-xl font-bold text-gray-700">
        المورد ده ملوش أي حركات مسجلة!
      </h3>
    </div>

    <div
      v-if="selectedInvoice"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200"
      >
        <div
          class="bg-indigo-50 p-4 border-b flex justify-between items-center"
        >
          <h2 class="font-black text-lg text-indigo-900">
            تفاصيل الفاتورة #{{
              selectedInvoice.invoice_number || selectedInvoice.id || "غير محدد"
            }}
          </h2>
          <button
            @click="selectedInvoice = null"
            class="text-slate-400 hover:text-red-500 font-bold text-xl transition"
          >
            ✖
          </button>
        </div>
        <div class="p-6">
          <div
            class="flex justify-between mb-6 text-sm font-bold text-slate-600 bg-slate-100 p-3 rounded-lg"
          >
            <span>التاريخ: {{ selectedInvoice.date }}</span>
            <span>النوع: {{ selectedInvoice.type }}</span>
          </div>
          <table class="w-full text-right text-sm border">
            <thead class="bg-slate-50 border-b">
              <tr>
                <th class="p-3">الصنف</th>
                <th class="p-3">الكمية</th>
                <th class="p-3">التكلفة</th>
                <th class="p-3">الإجمالي</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="item in selectedInvoice.items" :key="item.id">
                <td class="p-3 font-bold">{{ item.name }}</td>
                <td class="p-3">{{ item.quantity }}</td>
                <td class="p-3">{{ item.purchase_price || item.price }} ج</td>
                <td class="p-3 font-bold text-indigo-600">
                  {{ item.quantity * (item.purchase_price || item.price) }} ج
                </td>
              </tr>
              <tr
                v-if="
                  !selectedInvoice.items || selectedInvoice.items.length === 0
                "
              >
                <td
                  colspan="4"
                  class="p-6 text-center text-slate-500 font-medium"
                >
                  لا يوجد أصناف (هذه الحركة تسديد مالي فقط)
                </td>
              </tr>
            </tbody>
          </table>
          <div class="mt-6 flex justify-end">
            <div
              class="bg-indigo-50 text-indigo-800 px-6 py-3 rounded-xl font-black border border-indigo-100"
            >
              إجمالي الفاتورة:
              {{
                selectedInvoice.total_amount ||
                selectedInvoice.credit ||
                selectedInvoice.debit ||
                0
              }}
              ج.م
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const suppliers = ref([]);
const selectedSupplier = ref(null);
const statementData = ref([]);
const supplierName = ref("");
const currentBalance = ref(0);
const loading = ref(false);
const selectedInvoice = ref(null);

const fetchSuppliers = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/suppliers");
    suppliers.value = response.data.data || response.data;
  } catch (error) {
    console.error(error);
  }
};

const fetchStatement = async () => {
  if (!selectedSupplier.value) return;
  loading.value = true;
  statementData.value = [];
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/suppliers/${selectedSupplier.value}/statement`,
    );
    statementData.value = response.data.statement;
    supplierName.value = response.data.supplier_name;
    currentBalance.value = response.data.current_balance;
  } catch (error) {
    console.error(error);
  }
  loading.value = false;
};

const printStatement = () => window.print();

const showInvoiceDetails = async (row) => {
  // 1. استبعاد الدفعات وإشعارات التسوية لأن ملهاش أصناف
  if (
    row.type.includes("سداد") ||
    row.type.includes("دفعة") ||
    row.type.includes("إشعار")
  ) {
    alert("هذه الحركة عبارة عن تسوية مالية وليس لها تفاصيل أصناف.");
    return;
  }

  try {
    const invoiceId = row.invoice_id || row.id;
    if (!invoiceId) {
      selectedInvoice.value = row;
      return;
    }

    let url = "";
    // 2. هنا الذكاء: بنحدد الرابط حسب نوع الحركة
    if (row.type.includes("مرتجع")) {
      url = `http://127.0.0.1:8000/api/returns/${invoiceId}`; // رابط المرتجعات
    } else {
      url = `http://127.0.0.1:8000/api/purchases/${invoiceId}`; // رابط المشتريات
    }

    const response = await axios.get(url);
    selectedInvoice.value = response.data.data || response.data;
  } catch (error) {
    console.error("خطأ في جلب التفاصيل:", error);
    selectedInvoice.value = row; // كحل بديل لو حصل إيرور
  }
};

onMounted(fetchSuppliers);
</script>

<style scoped>
@media print {
  body {
    background-color: white !important;
  }
  @page {
    margin: 1cm;
  }
}
</style>

