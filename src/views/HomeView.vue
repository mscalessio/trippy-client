<script setup>
import Button from '../components/Button.vue';
import { useRouter } from 'vue-router';
import http from '@/helpers/http';

const router = useRouter();

const handleStartDriving = () => {
  http().get('/api/driver')
    .then((res) => {
      if (res.data.driver) {
        router.push({ name: 'standby' });
      } else {
        router.push({ name: 'driver' });
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const handleFindRide = () => {
  router.push({ name: 'location' });
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
        What's next?
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="flex justify-between">
        <Button @click="handleStartDriving">Start Driving</Button>
        <Button @click="handleFindRide">Find a Ride</Button>
      </div>
    </div>
  </div>
</template>
