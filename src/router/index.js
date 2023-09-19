import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import LocationView from "../views/LocationView.vue";
import MapView from "../views/MapView.vue";
import TripView from "../views/TripView.vue";
import StandbyView from "../views/StandbyView.vue";
import DriverView from "../views/DriverView.vue";
import DrivingView from "../views/DrivingView.vue";
import axios from "axios";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },
    {
      path: "/location",
      name: "location",
      component: LocationView,
    },
    {
      path: "/map",
      name: "map",
      component: MapView,
    },
    {
      path: "/trip",
      name: "trip",
      component: TripView,
    },
    {
      path: "/standby",
      name: "standby",
      component: StandbyView,
    },
    {
      path: "/driver",
      name: "driver",
      component: DriverView,
    },
    {
      path: "/driving",
      name: "driving",
      component: DrivingView,
    },
  ],
});

router.beforeEach((to, from) => {
  if (!localStorage.getItem("token") && to.name !== "login") {
    return { name: "login" };
  }

  checkTokenAuthenticity()
});

const checkTokenAuthenticity = () => {
  if (!localStorage.getItem("token")) {
    return true;
  }
  axios.get("http://trippy.test/api/user", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  .then((res) => {})
  .catch((err) => {
    localStorage.removeItem("token");
    router.push({ name: "login" });
  })
};

export default router;
