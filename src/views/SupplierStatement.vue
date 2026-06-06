<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    
    <div class="mb-8 print:hidden flex justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div class="w-1/3">
        <label class="block text-sm font-bold text-gray-700 mb-2">🚚 اختار المورد لعرض كشف الحساب</label>
        <select 
          v-model="selectedSupplier" 
          @change="fetchStatement"
          class="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500 font-bold"
        >
          <option :value="null" disabled>-- حدد المورد --</option>
          <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
            {{ supplier.name }}
          </option>
        </select>
      </div>

      <button 
        v-if="statementData.length > 0"
        @click="printStatement" 
        class="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-900 transition flex items-center gap-2 shadow-md"
      >
        🖨️ طباعة كشف الحساب
      </button>
    </div>

    <div v-if="loading" class="text-center py-20 text-xl font-bold text-gray-500">
      ⏳ جاري تجميع حسابات المورد...
    </div>

    <div v-if="!loading && statementData.length > 0" class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 print:shadow-none print:border-none print:p-0">
      
      <div class="text-center mb-8 border-b-2 border-gray-800 pb-6">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-2">كشف حساب مورد</h1>
        <p class="text-lg text-gray-600">السادة شركة/ <span class="font-bold text-gray-900">{{ supplierName }}</span></p>
        <p class="text-md text-gray-500 mt-1">تاريخ استخراج الكشف: {{ new Date().toLocaleDateString('ar-EG') }}</p>
      </div>

      <div class="flex justify-between items-center mb-6 bg-slate-100 p-4 rounded-xl print:bg-transparent print:border print:border-gray-300">
        <h3 class="text-xl font-bold text-gray-800">إجمالي المديونية (المطلوب سداده):</h3>
        <span class="text-2xl font-black" :class="currentBalance > 0 ? 'text-red-600' : 'text-green-600'">
          {{ Math.abs(currentBalance) }} ج.م 
          <span class="text-sm font-normal">{{ currentBalance > 0 ? '(ليه فلوس عندنا)' : currentBalance < 0 ? '(رصيد مقدم ليه)' : '(خالص)' }}</span>
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-right border-collapse">
          <thead>
            <tr class="bg-gray-800 text-white print:bg-gray-200 print:text-black">
              <th class="p-3 border border-gray-300">التاريخ</th>
              <th class="p-3 border border-gray-300">نوع الحركة</th>
              <th class="p-3 border border-gray-300 w-1/3">البيان</th>
              <th class="p-3 border border-gray-300 text-center">إجمالي (ليه)</th>
              <th class="p-3 border border-gray-300 text-center">مدفوع (أخدها)</th>
              <th class="p-3 border border-gray-300 text-center">الرصيد التراكمي</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in statementData" :key="index" class="hover:bg-slate-50 transition border-b border-gray-200">
              <td class="p-3 border border-gray-300 text-sm text-gray-600 whitespace-nowrap">{{ row.date }}</td>
              <td class="p-3 border border-gray-300 font-bold">
                <span :class="row.type === 'سداد نقدي' ? 'text-green-600' : 'text-orange-600'">
                  {{ row.type }}
                </span>
              </td>
              <td class="p-3 border border-gray-300 text-sm">{{ row.description }}</td>
              <td class="p-3 border border-gray-300 text-center font-bold text-red-600">{{ row.credit > 0 ? row.credit : '-' }}</td>
              <td class="p-3 border border-gray-300 text-center font-bold text-green-600">{{ row.debit > 0 ? row.debit : '-' }}</td>
              <td class="p-3 border border-gray-300 text-center font-black bg-slate-50 print:bg-transparent">
                <span :class="row.balance > 0 ? 'text-red-700' : 'text-green-700'">
                  {{ Math.abs(row.balance) }} {{ row.balance > 0 ? 'ليه' : row.balance < 0 ? 'رصيد مقدم' : '' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div v-if="!loading && selectedSupplier && statementData.length === 0" class="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <span class="text-4xl mb-4 block">📭</span>
      <h3 class="text-xl font-bold text-gray-700">المورد ده ملوش أي حركات مسجلة حتى الآن!</h3>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const suppliers = ref([]);
const selectedSupplier = ref(null);
const statementData = ref([]);
const supplierName = ref('');
const currentBalance = ref(0);
const loading = ref(false);

const fetchSuppliers = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/suppliers');
    suppliers.value = response.data.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
  }
};

const fetchStatement = async () => {
  if (!selectedSupplier.value) return;
  
  loading.value = true;
  statementData.value = [];
  
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/suppliers/${selectedSupplier.value}/statement`);
    statementData.value = response.data.statement;
    supplierName.value = response.data.supplier_name;
    currentBalance.value = response.data.current_balance;
  } catch (error) {
    alert("حصل خطأ أثناء جلب كشف الحساب!");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const printStatement = () => {
  window.print();
};

onMounted(() => {
  fetchSuppliers();
});
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