<script setup>
import { onMounted, ref } from "vue";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useTripStore } from "@/stores/trip";
import { useLocationStore } from "@/stores/location";
import Button from "../components/Button.vue";
import http from "@/helpers/http";
import { useRouter } from "vue-router";

const router = useRouter();
const defaultTitle = "Waiting for ride request...";
const title = ref(defaultTitle);
const gMap = ref(null);
const trip = useTripStore();
const location = useLocationStore();

const handleDeclineTrip = () => {
  trip.reset();
  title.value = defaultTitle;
};

const handleAcceptTrip = () => {
  http()
    .post(`/api/trip/${trip.id}/accept`, {
      driver_location: location.current.geometry,
    })
    .then((res) => {
      location.$patch({
        destination: {
          name: "Passenger",
          geometry: res.data.origin,
        },
      });

      router.push({ name: "driving" });
    })
    .catch((err) => {
      console.error(err);
    });
};

onMounted(async () => {
  await location.updateCurrentLocation();

  let echo = new Echo({
    broadcaster: "pusher",
    key: "mykey",
    cluster: "mt1",
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  });

  echo.channel("drivers").listen("TripCreated", (e) => {
    title.value = "Ride request received:";
    trip.$patch(e.trip);
    console.log("TripCreated", e);

    setTimeout(initMapDirections, 2000);
  });
});

const initMapDirections = () => {
  gMap.value.$mapPromise.then((mapObject) => {
    let originPoint = new google.maps.LatLng(trip.origin),
      destinationPoint = new google.maps.LatLng(trip.destination),
      directionsService = new google.maps.DirectionsService(),
      directionsDisplay = new google.maps.DirectionsRenderer({
        map: mapObject,
      });

    directionsService.route(
      {
        origin: originPoint,
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
        {{ title }}
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div
        v-if="!trip.id"
        class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto"
      >
        <div class="animate-pulse flex space-x-4">
          <div class="rounded-full bg-slate-200 h-10 w-10"></div>
          <div class="flex-1 space-y-6 py-1">
            <div class="h-2 bg-slate-200 rounded"></div>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                <div class="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div class="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto"
      >
        <div class="flex flex-col space-y-4">
          <GMapMap
            :zoom="14"
            :center="trip.destination"
            ref="gMap"
            style="width: 100%; height: 256px"
          ></GMapMap>

          <p>
            Going to <strong>{{ trip.destination_name }}</strong>
          </p>
          <div class="flex justify-between">
            <Button @click="handleDeclineTrip">Decline</Button>
            <Button @click="handleAcceptTrip">Accept</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
