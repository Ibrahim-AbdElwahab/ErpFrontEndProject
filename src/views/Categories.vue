<template>
  <div class="p-6 bg-slate-50 min-h-screen" dir="rtl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">إدارة فئات وأقسام المخزن</h1>
      <button
        @click="showAddModal = true"
        class="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition shadow-sm"
      >
        + قسم جديد
      </button>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl"
    >
      <table class="w-full text-right text-sm">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th class="p-4 w-20">كود القسم</th>
            <th class="p-4">اسم القسم</th>
            <th class="p-4 text-center w-40">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="cat in categories"
            :key="cat.id"
            class="border-b hover:bg-slate-50 transition"
          >
            <td class="p-4 font-mono text-gray-500">#{{ cat.id }}</td>
            <td class="p-4 font-bold text-gray-800">{{ cat.name }}</td>
            <td class="p-4 text-center">
              <button
                @click="openEditModal(cat)"
                class="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold hover:bg-blue-200 transition"
              >
                ✏️ تعديل الاسم
              </button>
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
        <h2 class="text-xl font-bold mb-4 text-gray-800">إضافة قسم جديد</h2>
        <input
          v-model="newCategoryName"
          placeholder="مثال: موبايلات، شاشات، قطع غيار..."
          class="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          @keyup.enter="saveCategory"
        />
        <div class="flex gap-2 mt-5">
          <button
            @click="saveCategory"
            :disabled="loading"
            class="bg-purple-600 text-white w-full py-2 rounded-lg font-bold hover:bg-purple-700 transition"
          >
            {{ loading ? "جاري الحفظ..." : "حفظ القسم" }}
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
      <div class="bg-white p-6 rounded-xl w-96 shadow-2xl">
        <h2 class="text-xl font-bold mb-4 text-gray-800">تعديل اسم القسم</h2>
        <div class="space-y-1 mb-4">
          <label class="text-xs font-bold text-gray-400">
            الاسم الحالي: {{ activeCategory?.name }}
          </label>
          <input
            v-model="editCategoryName"
            placeholder="اكتب الاسم الجديد للقسم..."
            class="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700"
            @keyup.enter="submitEdit"
          />
        </div>
        <div class="flex gap-2">
          <button
            @click="submitEdit"
            :disabled="loading"
            class="bg-blue-600 text-white w-full py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
          >
            {{ loading ? "جاري التحديث..." : "تحديث الاسم 💾" }}
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
import { ref, onMounted } from "vue";
import axios from "axios";

const categories = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const loading = ref(false);

const newCategoryName = ref("");
const activeCategory = ref(null);
const editCategoryName = ref("");

const fetchCategories = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/categories");
    categories.value = res.data.data;
  } catch (error) {
    console.error("Error loading categories:", error);
  }
};

const saveCategory = async () => {
  if (!newCategoryName.value.trim()) return;
  loading.value = true;
  try {
    await axios.post("http://127.0.0.1:8000/api/categories", {
      name: newCategoryName.value,
    });
    showAddModal.value = false;
    newCategoryName.value = "";
    fetchCategories();
  } catch (error) {
    alert("القسم ده موجود بالفعل أو حصلت مشكلة!");
  } finally {
    loading.value = false;
  }
};

const openEditModal = (category) => {
  activeCategory.value = category;
  editCategoryName.value = category.name;
  showEditModal.value = true;
};

const submitEdit = async () => {
  if (!editCategoryName.value.trim()) return;
  loading.value = true;
  try {
    await axios.put(
      `http://127.0.0.1:8000/api/categories/${activeCategory.value.id}`,
      { name: editCategoryName.value },
    );
    showEditModal.value = false;
    fetchCategories();
  } catch (error) {
    alert("خطأ في تحديث الاسم، تأكد إنه مش متكرر");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCategories);
</script>
