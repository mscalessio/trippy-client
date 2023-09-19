<script setup>
import { vMaska } from "maska";
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";

const router = useRouter();

const waitingForVerification = ref(false);

onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push({ name: "home" });
  }
});

const form = reactive({
  phone: null,
  login_code: null,
});

const getFormattedForm = () => {
  return {
    phone: form.phone.replaceAll(" ", "").replace("+", ""),
    login_code: form.login_code,
  };
};

const handleLogin = () => {
  axios
    .post("http://trippy.test/api/login", getFormattedForm())
    .then((res) => {
      console.log(res.data);
      waitingForVerification.value = true;
    })
    .catch((err) => {
      console.error(err);
      alert(err.response.data.message);
    });
};

const handleVerification = () => {
  axios
    .post("http://trippy.test/api/login/verify", getFormattedForm())
    .then((res) => {
      console.log(res.data);
      localStorage.setItem("token", res.data);
      router.push({ name: "home" });
    })
    .catch((err) => {
      console.error(err);
      alert(err.response.data.message);
    });
};
</script>
<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      />
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form
        v-if="!waitingForVerification"
        class="space-y-6"
        @submit.prevent="handleLogin"
      >
        <div>
          <label
            for="phone"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Phone Number</label
          >
          <div class="mt-2">
            <input
              id="phone"
              name="phone"
              type="phone"
              autocomplete="phone"
              v-maska
              data-maska="+39 ### ### ####"
              placeholder="+39 123 456 7890"
              required
              v-model="form.phone"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </div>
      </form>
      <form v-else class="space-y-6" @submit.prevent="handleVerification">
        <div>
          <label
            for="login_code"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Verification code</label
          >
          <div class="mt-2">
            <input
              type="text"
              id="login_code"
              name="login_code"
              v-maska
              data-maska="######"
              placeholder="123456"
              required
              v-model="form.login_code"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
