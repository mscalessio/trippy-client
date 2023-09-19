<script setup>
import { reactive } from "vue";
import Button from "../components/Button.vue";
import http from '@/helpers/http';
import { useRouter } from 'vue-router';

const router = useRouter();

const driverDetails = reactive({
  name: "",
  year: null,
  make: "",
  model: "",
  color: "",
  license_plate: "",
});

const handleSaveDriver = () => {
  http()
    .post("/api/driver", driverDetails)
    .then((res) => {
      router.push({ name: "standby" });
    })
    .catch((err) => {
      console.error(err);
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
        Driver and car details
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" @submit.prevent="handleSaveDriver">
        <div>
          <label
            for="name"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Full Name</label
          >
          <div class="mt-2">
            <input
              id="name"
              name="name"
              type="text"
              autocomplete="name"
              placeholder="Full Name"
              v-model="driverDetails.name"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            for="year"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Car Year</label
          >
          <div class="mt-2">
            <input
              id="year"
              name="year"
              type="number"
              placeholder="Car Year"
              v-model="driverDetails.year"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            for="make"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Make</label
          >
          <div class="mt-2">
            <input
              id="make"
              name="make"
              type="text"
              placeholder="Make"
              v-model="driverDetails.make"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            for="model"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Model</label
          >
          <div class="mt-2">
            <input
              id="model"
              name="model"
              type="text"
              placeholder="Model"
              v-model="driverDetails.model"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            for="color"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Color</label
          >
          <div class="mt-2">
            <input
              id="color"
              name="color"
              type="text"
              placeholder="color"
              v-model="driverDetails.color"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            for="license_plate"
            class="block text-sm font-medium leading-6 text-gray-900"
            >License Plate #</label
          >
          <div class="mt-2">
            <input
              id="license_plate"
              name="license_plate"
              type="text"
              placeholder="License Plate #"
              v-model="driverDetails.license_plate"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <Button @click.prevent="handleSaveDriver">Save</Button>
        </div>
      </form>
    </div>
  </div>
</template>
