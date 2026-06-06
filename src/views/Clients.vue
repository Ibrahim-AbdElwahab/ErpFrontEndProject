<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="print:hidden" dir="rtl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">
          دفتر العملاء والديون الجارية
        </h1>
        <div class="flex gap-2">
          <button
            @click="window.print()"
            class="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-900 transition"
          >
            🖨️ طباعة الدفتر بالكامل
          </button>
          <button
            @click="showAddModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            + عميل جديد
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
              <th class="p-4">المديونية الحالية</th>
              <th class="p-4 text-center">إجراءات التحكم</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="client in clients"
              :key="client.id"
              class="border-b hover:bg-slate-50 transition"
            >
              <td class="p-4 font-bold text-gray-800">{{ client.name }}</td>
              <td class="p-4 font-mono text-gray-600">
                {{ client.phone || "-" }}
              </td>
              <td
                class="p-4 font-bold"
                :class="client.balance < 0 ? 'text-red-600' : 'text-green-600'"
              >
                {{ Math.abs(client.balance) }} ج.م
                {{
                  client.balance < 0
                    ? "(عليه مديونية)"
                    : client.balance > 0
                      ? "(ليه رصيد مقدم)"
                      : "خالص الحساب"
                }}
              </td>
              <td class="p-4 flex gap-2 justify-center">
                <button
                  @click="openEditModal(client)"
                  class="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold hover:bg-blue-200 transition"
                >
                  ✏️ تعديل وتسوية
                </button>
                <button
                  @click="openPayModal(client)"
                  class="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold hover:bg-green-200 transition"
                >
                  💰 استلام نقدية
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
      v-if="!printReceiptData"
    >
      <h2 class="text-2xl font-black text-center mb-6 border-b-2 pb-2">
        كشف تفصيلي بإجمالي ديون العملاء
      </h2>
      <table
        class="w-full text-right text-sm border-collapse border border-black"
      >
        <thead>
          <tr class="bg-gray-100 border-b border-black font-bold">
            <th class="p-2 border border-black">الاسم</th>
            <th class="p-2 border border-black">الموبايل</th>
            <th class="p-2 border border-black">الرصيد المالي الحالي</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="client in clients"
            :key="client.id"
            class="border-b border-black"
          >
            <td class="p-2 border border-black font-bold">{{ client.name }}</td>
            <td class="p-2 border border-black font-mono">
              {{ client.phone || "---" }}
            </td>
            <td class="p-2 border border-black font-bold">
              {{ client.balance }} ج.م
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="printReceiptData"
      class="hidden print:block w-full bg-white text-black font-sans p-2"
      dir="rtl"
    >
      <div
        class="flex justify-between items-center mb-4 border-b-2 border-black pb-2"
      >
        <div class="text-right text-xs font-bold text-gray-500">
          <p>الوقت: {{ new Date().toLocaleTimeString("ar-EG") }}</p>
          <p>الجمعة / السبت الجاري</p>
        </div>
        <div class="text-center">
          <h2 class="text-3xl font-black tracking-wider">إستلام نقدية</h2>
          <p class="text-base font-mono font-bold mt-1 text-gray-800">
            رقم الحركة: {{ receiptNumber }}
          </p>
        </div>
        <div class="text-left text-sm font-bold">
          <p>التاريخ: {{ new Date().toLocaleDateString("en-GB") }}</p>
        </div>
      </div>

      <table
        class="w-full border-collapse border-2 border-black text-right text-sm font-bold mb-6"
      >
        <tbody>
          <tr>
            <td class="border border-black p-2.5 bg-gray-100 w-1/5">
              التاريخ والوقت
            </td>
            <td class="border border-black p-2.5 w-2/5 font-mono">
              {{ new Date().toLocaleDateString("en-GB") }}
            </td>
            <td class="border border-black p-2.5 bg-gray-100 w-1/5">المندوب</td>
            <td class="border border-black p-2.5 w-1/5 text-center">
              340 / شادي
            </td>
          </tr>
          <tr>
            <td class="border border-black p-2.5 bg-gray-100">الإسم الكريم</td>
            <td
              colspan="3"
              class="border border-black p-2.5 text-lg text-blue-900 font-black pr-4"
            >
              {{ printReceiptData.name }}
            </td>
          </tr>
          <tr>
            <td class="border border-black p-2.5 bg-gray-100">رقم الدفتر</td>
            <td class="border border-black p-2.5 font-normal text-gray-500">
              بدون مستخدم
            </td>
            <td class="border border-black p-2.5 bg-gray-100">الكاتب</td>
            <td class="border border-black p-2.5 text-center">
              النظام الإلكتروني
            </td>
          </tr>
          <tr>
            <td class="border border-black p-2.5 bg-gray-100">
              الخزينة الموجهة
            </td>
            <td
              colspan="3"
              class="border border-black p-2.5 font-black text-gray-800"
            >
              الخزينه الرئيسيه
            </td>
          </tr>
          <tr>
            <td class="border border-black p-2.5 bg-gray-100 text-green-700">
              المبلغ المقبوض
            </td>
            <td
              class="border border-black p-2.5 text-xl font-black text-green-700 font-mono tracking-wide bg-green-50/50"
            >
              {{ printReceiptData.amount }} ج.م
            </td>
            <td class="border border-black p-2.5 bg-gray-100">حالة التفقيط</td>
            <td
              class="border border-black p-2.5 text-center text-xs text-gray-500"
            >
              مبلغ مدفوع فقط لا غير
            </td>
          </tr>
          <tr>
            <td class="border border-black p-2.5 bg-gray-100">وذلك عن قيمة</td>
            <td colspan="3" class="border border-black p-2.5 font-normal">
              سداد دفعة مالية نقدية من حساب العميل الجاري بالشركة.
            </td>
          </tr>
          <tr>
            <td class="border border-black p-2.5 bg-gray-100">
              ملاحظات وتسوية
            </td>
            <td
              colspan="3"
              class="border border-black p-2.5 font-normal text-gray-400"
            >
              --- لا توجد ملاحظات إضافية ---
            </td>
          </tr>
          <tr class="bg-gray-50 text-base">
            <td class="border-2 border-black p-3 bg-gray-200 font-black">
              الحساب السابق
            </td>
            <td
              class="border-2 border-black p-3 font-mono text-red-600 font-bold text-center"
            >
              {{ Math.abs(printReceiptData.oldBalance) }} ج.م (مدين ع)
            </td>
            <td class="border-2 border-black p-3 bg-gray-200 font-black">
              الرصيد المتبقي الحالي
            </td>
            <td
              class="border-2 border-black p-3 font-mono text-gray-900 font-black text-center bg-gray-100"
            >
              {{ Math.abs(printReceiptData.newBalance) }} ج.م
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-between mt-12 px-8 font-bold text-sm">
        <div class="text-right space-y-4">
          <p>اسم المستلم / ....................................</p>
          <p class="text-xs text-gray-400 font-normal mr-8">
            التوقيع الإلكتروني معتمد
          </p>
        </div>
        <div class="text-left space-y-4">
          <p>توقيع العميل / ....................................</p>
        </div>
      </div>
    </div>

    <div
      v-if="showAddModal"
      class="print:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl w-96">
        <h2 class="text-xl font-bold mb-4">إضافة عميل جديد للدفتر</h2>
        <input
          v-model="newClient.name"
          placeholder="اسم العميل"
          class="w-full border p-2 rounded mb-3 outline-none focus:ring-2"
        />
        <input
          v-model="newClient.phone"
          placeholder="رقم الموبايل"
          class="w-full border p-2 rounded mb-3 outline-none focus:ring-2"
        />
        <input
          v-model="newClient.balance"
          type="number"
          placeholder="الرصيد الافتتاحي (بالسالب لو عليه فلوس)"
          class="w-full border p-2 rounded mb-4 outline-none focus:ring-2"
        />
        <div class="flex gap-2">
          <button
            @click="saveClient"
            class="bg-blue-600 text-white w-full py-2 rounded-lg font-bold"
          >
            حفظ العميل
          </button>
          <button
            @click="showAddModal = false"
            class="bg-gray-200 w-full py-2 rounded-lg"
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
      <div class="bg-white p-6 rounded-xl w-96 border-2 border-green-500">
        <h2 class="text-xl font-bold mb-4">
          تحصيل واستلام دفعة من: {{ activeClient?.name }}
        </h2>
        <input
          v-model="payAmount"
          type="number"
          placeholder="المبلغ المقبوض ج.م"
          class="w-full border-2 border-green-400 p-3 text-xl font-bold text-center rounded mb-4 outline-none focus:ring-2 focus:ring-green-500"
        />
        <div class="flex gap-2">
          <button
            @click="submitPayment"
            :disabled="loading"
            class="bg-green-600 text-white w-full py-2 rounded-lg font-bold hover:bg-green-700 transition"
          >
            حفظ وطباعة الإيصال الرسمي 🖨️
          </button>
          <button
            @click="showPayModal = false"
            class="bg-gray-200 w-full py-2 rounded-lg"
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
          تعديل بيانات وتجنيب: {{ activeClient?.name }}
        </h2>
        <div class="space-y-3 mb-4">
          <input
            v-model="editData.name"
            placeholder="اسم العميل"
            class="w-full border p-2 rounded outline-none focus:ring-2"
          />
          <input
            v-model="editData.phone"
            placeholder="رقم الموبايل"
            class="w-full border p-2 rounded outline-none focus:ring-2"
          />
        </div>

        <div class="border-t pt-4 bg-slate-50 p-4 rounded-lg">
          <h3 class="font-bold text-sm text-gray-700 mb-3">
            إشعارات التسوية المالية (بدون كاش)
          </h3>
          <div class="flex gap-2 mb-2">
            <select
              v-model="editData.adjustment_type"
              class="border p-2 rounded flex-1 font-bold outline-none"
            >
              <option value="">-- بدون تسوية حالياً --</option>
              <option value="discount">📉 إشعار خصم (تقليل الدين)</option>
              <option value="addition">📈 إشعار إضافة (تزويد الدين)</option>
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
            placeholder="السبب (مثال: خصم خاص، بونص...)"
            class="w-full border p-2 rounded text-sm mt-2 outline-none"
          />
        </div>

        <div class="flex gap-2 mt-4">
          <button
            @click="submitEdit"
            :disabled="loading"
            class="bg-blue-600 text-white w-full py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            حفظ التعديلات
          </button>
          <button
            @click="showEditModal = false"
            class="bg-gray-200 w-full py-2 rounded-lg"
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

const clients = ref([]);
const showAddModal = ref(false);
const showPayModal = ref(false);
const showEditModal = ref(false);

const newClient = ref({ name: "", phone: "", balance: 0 });
const activeClient = ref(null);
const payAmount = ref("");
const loading = ref(false);
const printReceiptData = ref(null);
const receiptNumber = ref("");

const editData = ref({
  name: "",
  phone: "",
  adjustment_type: "",
  adjustment_amount: "",
  adjustment_note: "",
});

const fetchClients = async () => {
  const res = await axios.get("http://127.0.0.1:8000/api/clients");
  clients.value = res.data.data;
};

const saveClient = async () => {
  await axios.post("http://127.0.0.1:8000/api/clients", newClient.value);
  showAddModal.value = false;
  newClient.value = { name: "", phone: "", balance: 0 };
  fetchClients();
};

const openPayModal = (client) => {
  activeClient.value = client;
  showPayModal.value = true;
};

const submitPayment = async () => {
  loading.value = true;
  try {
    const oldBalance = activeClient.value.balance;
    const amountPaid = parseFloat(payAmount.value);

    await axios.post(
      `http://127.0.0.1:8000/api/clients/${activeClient.value.id}/pay`,
      { amount: amountPaid },
    );

    receiptNumber.value = Math.floor(1000 + Math.random() * 9000).toString();

    // حفظ الداتا المؤقتة اللازمة للإيصال المطبوع فوراً قبل تصفير الشاشة
    printReceiptData.value = {
      name: activeClient.value.name,
      amount: amountPaid,
      oldBalance: oldBalance,
      newBalance: oldBalance + amountPaid, // بما إن رصيده بالسالب فلما يدفع بنجمع عشان يقرب للصفر
    };

    setTimeout(() => {
      window.print();
      showPayModal.value = false;
      payAmount.value = "";
      printReceiptData.value = null;
      fetchClients();
    }, 400);
  } catch (error) {
    alert("خطأ في تحصيل الدفعة");
  }
  loading.value = false;
};

const openEditModal = (client) => {
  activeClient.value = client;
  editData.value = {
    name: client.name,
    phone: client.phone || "",
    adjustment_type: "",
    adjustment_amount: "",
    adjustment_note: "",
  };
  showEditModal.value = true;
};

const submitEdit = async () => {
  loading.value = true;
  try {
    await axios.put(
      `http://127.0.0.1:8000/api/clients/${activeClient.value.id}`,
      editData.value,
    );
    showEditModal.value = false;
    fetchClients();
  } catch (error) {
    alert("خطأ في حفظ التعديل والتسوية");
  }
  loading.value = false;
};

onMounted(fetchClients);
</script>

<style scoped>
@media print {
  @page {
    margin: 12mm;
    size: A4 portrait;
  }
  body {
    background: white !important;
    -webkit-print-color-adjust: exact;
  }
}
</style>
