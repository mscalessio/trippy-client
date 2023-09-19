<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useLocationStore } from "@/stores/location";
import { useTripStore } from "@/stores/trip";
import { useRouter } from "vue-router";
import http from "@/helpers/http";
import Button from "../components/Button.vue";
import Tada from "../components/Tada.vue";

const location = useLocationStore();
const trip = useTripStore();
const router = useRouter();

const gMap = ref(null);
const intervalRef = ref(null);

const title = ref("Driving to passenger...");

const currentIcon = {
  url: "https://openmoji.org/data/color/svg/1F698.svg",
  scaledSize: {
    width: 32,
    height: 32,
  },
};

const destinationIcon = {
  url: "https://openmoji.org/data/color/svg/1F920.svg",
  scaledSize: {
    width: 24,
    height: 24,
  },
};

const updadeMapBounds = (mapObject) => {
  let originPoint = new google.maps.LatLng(location.current.geometry),
    destinationPoint = new google.maps.LatLng(location.destination.geometry),
    latLngBounds = new google.maps.LatLngBounds();

  latLngBounds.extend(originPoint);
  latLngBounds.extend(destinationPoint);

  mapObject.fitBounds(latLngBounds);
};

const broadcastDriverLocation = () => {
  http()
    .post(`/api/trip/${trip.id}/location`, {
      driver_location: location.current.geometry,
    })
    .then((res) => {})
    .catch((err) => {
      console.error(err);
    });
};

const handlePassengerPickedUp = () => {
  http()
    .post(`/api/trip/${trip.id}/start`)
    .then((response) => {
      title.value = "Travelling to destination...";
      location.$patch({
        destination: {
          name: response.data.destination_name,
          geometry: response.data.destination,
        },
      });
      trip.$patch(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};

const handleCompleteTrip = () => {
  http()
    .post(`/api/trip/${trip.id}/end`)
    .then((response) => {
      title.value = "Trip completed!";

      trip.$patch(response.data);

      setTimeout(() => {
        trip.reset();
        location.reset();

        router.push({
          name: "standby",
        });
      }, 3000);
    })
    .catch((error) => {
      console.error(error);
    });
};

onMounted(() => {
  gMap.value.$mapPromise.then((mapObject) => {
    updadeMapBounds(mapObject);

    intervalRef.value = setInterval(async () => {
      await location.updateCurrentLocation();

      broadcastDriverLocation();

      updadeMapBounds(mapObject);
    }, 10000);
  });
});

onUnmounted(() => {
  clearInterval(intervalRef.value);

  intervalRef.value = null;
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

    <div
      class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
      v-if="!trip.is_complete"
    >
      <div>
        <GMapMap
          ref="gMap"
          :center="location.current.geometry"
          :zoom="14"
          style="width: 100%; height: 256px"
        >
          <GMapMarker
            :position="location.current.geometry"
            :icon="currentIcon"
          />
          <GMapMarker
            :position="location.destination.geometry"
            :icon="destinationIcon"
          />
        </GMapMap>
      </div>
      <p>
        <span>Going to <strong>pick up a passenger.</strong></span>
      </p>
      <div class="flex justify-between">
        <Button v-if="trip.is_started" @click="handleCompleteTrip">Complete Trip</Button>
        <Button v-else @click="handlePassengerPickedUp">Passenger Picked Up</Button>
      </div>
    </div>
    <div v-else class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="bg-white px-4 py-5 sm:p-6">
        <Tada />
      </div>
    </div>
  </div>
</template>
