import axios from "axios";

const http = () => {
  let options = {
    baseURL: "http://trippy.test",
    headers: {},
  };

  if (localStorage.getItem("token")) {
    options.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }

  return axios.create(options);
};

export default http;
