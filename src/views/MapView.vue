<script setup>
import { useRouter } from "vue-router";
import Button from "../components/Button.vue";
import { useLocationStore } from "@/stores/location";
import { useTripStore } from "@/stores/trip";
import { onMounted, ref } from "vue";
import http from "@/helpers/http";

const location = useLocationStore();
const trip = useTripStore();
const router = useRouter();

const gMap = ref(null);

const handleConfirmTrip = () => {
  http()
    .post("/api/trip", {
      origin: location.current.geometry,
      destination: location.destination.geometry,
      destination_name: location.destination.name,
    })
    .then((res) => {
      trip.$patch(res.data);
      router.push({ name: "trip" });
    })
    .catch((err) => {
      console.error(err);
    });
};

onMounted(async () => {
  if (location.destination.name === "") {
    router.push({ name: "location" });
  }

  await location.updateCurrentLocation();

  gMap.value.$mapPromise.then((mapObject) => {
    let currentPoint = new google.maps.LatLng(location.current.geometry),
      destinationPoint = new google.maps.LatLng(location.destination.geometry),
      directionsService = new google.maps.DirectionsService(),
      directionsDisplay = new google.maps.DirectionsRenderer({
        map: mapObject,
      });

    directionsService.route(
      {
        origin: currentPoint,
        destination: destinationPoint,
        avoidTolls: false,
        avoidHighways: false,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (res, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(res);
        } else {
          console.warn(status);
        }
      }
    );
  });
});
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
        Here's your trip
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div>
        <GMapMap
          ref="gMap"
          :zoom="11"
          :center="location.destination.geometry"
          style="width: 100%; height: 256px"
        >
        </GMapMap>
      </div>
      <p class="text-lg">
        Going to <strong>{{ location.destination.name }}</strong>
      </p>
      <div class="flex justify-end">
        <Button @click.prevent="handleConfirmTrip">Let's go</Button>
      </div>
    </div>
  </div>
</template>
