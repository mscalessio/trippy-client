<script setup>
import { useLocationStore } from "@/stores/location";
import { useTripStore } from "@/stores/trip";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

const location = useLocationStore();
const trip = useTripStore();
const router = useRouter();

const title = ref("Waiting for a driver..");
const message = ref(
  "When a driver accepts the trip, their info will appear here."
);

const gMap = ref(null);
const gMapObject = ref(null);

const currentIcon = {
  url: "https://openmoji.org/data/color/svg/1F920.svg",
  scaledSize: {
    width: 24,
    height: 24,
  },
};

const driverIcon = {
  url: "https://openmoji.org/data/color/svg/1F698.svg",
  scaledSize: {
    width: 32,
    height: 32,
  },
};

const updateMapBounds = () => {
  let originPoint = new google.maps.LatLng(location.current.geometry),
    driverPoint = new google.maps.LatLng(trip.driver_location),
    latLngBounds = new google.maps.LatLngBounds();

  latLngBounds.extend(originPoint);
  latLngBounds.extend(driverPoint);

  gMapObject.value.fitBounds(latLngBounds);
};

onMounted(() => {
  gMap.value.$mapPromise.then((mapObject) => {
    gMapObject.value = mapObject;
  });

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

  echo
    .channel(`passenger_${trip.user_id}`)
    .listen("TripAccepted", (e) => {
      console.log("TripAccepted", e);
      trip.$patch(e.trip);

      title.value = "A driver is on the way!";
      message.value = `Driver ${e.trip.driver.user.name} is coming in a ${e.trip.driver.year} ${e.trip.driver.color} ${e.trip.driver.make} ${e.trip.driver.model} with license plate #${e.trip.driver.license_plate}.`;
    })
    .listen("TripLocationUpdated", (e) => {
      console.log("TripLocationUpdated", e);
      trip.$patch(e.trip);

      setTimeout(updateMapBounds, 1000);
    })
    .listen("TripStarted", (e) => {
      console.log("TripStarted", e);
      trip.$patch(e.trip);
      location.$patch({
        current: {
          geometry: e.trip.destination,
        },
      });

      title.value = "You're on your way!";
      message.value = `You are headed to ${e.trip.destination_name}`;
    })
    .listen("TripEnded", (e) => {
      console.log("TripEnded", e);
      trip.$patch(e.trip);

      title.value = "You've arrived!";
      message.value = `Hope you enjoyed your ride with ${e.trip.driver.user.name}`;

      setTimeout(() => {
        trip.reset();
        location.reset();

        router.push({
          name: "landing",
        });
      }, 10000);
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
        {{ title }}
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div>
        <GMapMap
          ref="gMap"
          :zoom="14"
          :center="location.current.geometry"
          style="width: 100%; height: 256px"
        >
          <GMapMarker
            :position="location.current.geometry"
            :icon="currentIcon"
          />
          <GMapMarker :position="trip.driver_location" :icon="driverIcon" />
        </GMapMap>
      </div>
      <p>
        <span>{{ message }}</span>
      </p>
    </div>
  </div>
</template>
