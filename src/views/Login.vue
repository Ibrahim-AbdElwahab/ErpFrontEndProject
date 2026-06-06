<template>
  <div class="min-h-screen bg-slate-800 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-blue-200"
        >
          ⚙️
        </div>
        <h2 class="text-2xl font-bold text-gray-800">نظام إدارة الـ ERP</h2>
        <p class="text-gray-500 mt-2">سجل دخولك للمتابعة</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            البريد الإلكتروني
          </label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition"
            required
            placeholder="admin@erp.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            كلمة المرور
          </label>
          <input
            v-model="form.password"
            type="password"
            class="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition"
            required
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:bg-gray-400"
        >
          {{ loading ? "جاري التحقق..." : "تسجيل الدخول" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const loading = ref(false);

const form = ref({
  email: "admin@admin.com", // الإيميل اللي عملناه في الـ Seeder كقيمة افتراضية
  password: "password",
});

const handleLogin = async () => {
  loading.value = true;
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/login",
      form.value,
    );

    // حفظ التوكن في الـ LocalStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // توجيه المستخدم للوحة التحكم
    router.push("/");
  } catch (error) {
    alert("بيانات الدخول غلط يا هندسة، ركز!");
  } finally {
    loading.value = false;
  }
};
</script>
