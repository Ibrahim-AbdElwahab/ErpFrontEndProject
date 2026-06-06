<template>
  <div class="grid grid-cols-12 gap-6 h-[calc(100vh-100px)]">
    
    <div class="col-span-7 flex flex-col space-y-4 h-full">
      
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="🔍 ابحث عن صنف لشرائه وتزويد المخزن..." 
            class="w-full border border-gray-300 rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
        </div>
      </div>

      <div class="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="grid grid-cols-3 gap-4">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id"
            @click="addToCart(product)"
            class="bg-gray-50 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-green-500 hover:shadow-md transition group"
          >
            <h3 class="font-bold text-gray-800 group-hover:text-green-600 line-clamp-2">{{ product.name }}</h3>
            <p class="text-xs text-gray-500 mt-1">بالمخزن حالياً: {{ product.stock_quantity }}</p>
            <p class="text-green-600 font-bold mt-2">آخر سعر شراء: {{ product.purchase_price }} ج.م</p>
          </div>
        </div>
        <div v-if="filteredProducts.length === 0" class="text-center py-10 text-gray-400">
          مفيش صنف بالاسم ده يا هندسة!
        </div>
      </div>
    </div>

    <div class="col-span-5 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col h-full">
      
      <div class="p-4 border-b bg-slate-50 rounded-t-xl">
        <label class="block text-sm font-bold text-gray-700 mb-2">🚚 المورد (اختياري لو كاش)</label>
        <select v-model="selectedSupplier" class="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-green-500">
          <option :value="null">-- شراء نقدي (بدون مورد) --</option>
          <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
            {{ supplier.name }} (رصيده: {{ supplier.balance }} ج.م)
          </option>
        </select>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        <div v-if="cart.length === 0" class="text-center py-10 text-gray-400 font-medium">
          🛒 الفاتورة فاضية.. اختار أصناف لشرائها
        </div>
        
        <div v-for="item in cart" :key="item.id" class="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-bold text-sm text-gray-800">{{ item.name }}</h4>
            <button @click="removeFromCart(item)" class="text-red-400 hover:text-red-600 text-sm">✖ حذف</button>
          </div>
          
          <div class="flex gap-4 items-center">
            <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button @click="updateQty(item, -1)" class="w-6 h-6 bg-white rounded text-gray-600 font-bold shadow-sm">-</button>
              <span class="w-8 text-center font-bold text-sm">{{ item.qty }}</span>
              <button @click="updateQty(item, 1)" class="w-6 h-6 bg-white rounded text-gray-600 font-bold shadow-sm">+</button>
            </div>

            <div class="flex-1">
              <input v-model="item.purchase_price" type="number" class="w-full border border-gray-300 rounded-lg p-1 text-center font-bold text-green-600 outline-none" placeholder="سعر الشراء">
            </div>
            
            <div class="font-bold text-gray-800 w-20 text-left">
              {{ item.purchase_price * item.qty }} ج
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 border-t bg-white rounded-b-xl space-y-4">
        <div class="flex justify-between text-lg font-bold text-gray-800">
          <span>إجمالي الفاتورة:</span>
          <span>{{ totalAmount }} ج.م</span>
        </div>
        
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">المدفوع نقداً (هيخرج من الخزنة)</label>
          <input v-model="paidAmount" type="number" class="w-full border-2 border-red-400 rounded-lg p-3 text-center text-xl font-bold text-red-700 outline-none focus:ring-red-600">
          
          <p v-if="selectedSupplier && paidAmount < totalAmount" class="text-xs text-orange-600 font-bold mt-1">
            ⚠️ الباقي ({{ totalAmount - paidAmount }} ج.م) هيتسجل كدين علينا للمورد.
          </p>
          <p v-if="!selectedSupplier && paidAmount < totalAmount" class="text-xs text-red-600 font-bold mt-1">
            ❌ لازم تحدد اسم المورد عشان تسجل الباقي آجل!
          </p>
        </div>

        <button 
          @click="submitInvoice" 
          :disabled="cart.length === 0 || (!selectedSupplier && paidAmount < totalAmount) || loading"
          class="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-400 shadow-lg"
        >
          {{ loading ? 'جاري الحفظ...' : 'حفظ فاتورة المشتريات' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const products = ref([]);
const suppliers = ref([]);
const cart = ref([]);
const searchQuery = ref('');
const selectedSupplier = ref(null);
const paidAmount = ref(0);
const loading = ref(false);

const fetchData = async () => {
  try {
    const [prodRes, supRes] = await Promise.all([
      axios.get('http://127.0.0.1:8000/api/products'),
      axios.get('http://127.0.0.1:8000/api/suppliers') // هنجيب الموردين هنا
    ]);
    products.value = prodRes.data.data;
    suppliers.value = supRes.data.data;
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

const filteredProducts = computed(() => {
  return products.value.filter(p => p.name.includes(searchQuery.value));
});

const totalAmount = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.purchase_price * item.qty), 0);
});

const addToCart = (product) => {
  const item = cart.value.find(i => i.id === product.id);
  if (item) {
    item.qty++;
  } else {
    // بناخد نسخة ونحطها في السلة
    cart.value.push({ ...product, qty: 1 });
  }
};

const updateQty = (item, change) => {
  if (change > 0) item.qty++;
  else if (change < 0 && item.qty > 1) item.qty--;
};

const removeFromCart = (item) => {
  cart.value = cart.value.filter(i => i.id !== item.id);
};

const submitInvoice = async () => {
  loading.value = true;
  try {
    const data = {
      supplier_id: selectedSupplier.value,
      paid_amount: paidAmount.value,
      items: cart.value.map(i => ({ 
        product_id: i.id, 
        quantity: i.qty, 
        purchase_price: i.purchase_price // بنبعت سعر الشراء الجديد
      }))
    };
    await axios.post('http://127.0.0.1:8000/api/purchase-invoices', data);
    alert('تم حفظ فاتورة المشتريات بنجاح! 📦');
    
    // تصفير الشاشة
    cart.value = [];
    selectedSupplier.value = null;
    paidAmount.value = 0;
    fetchData(); // تحديث الكميات في المخزن
  } catch (error) {
    alert('خطأ في حفظ الفاتورة، راجع الكونسول أو الـ Network');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>