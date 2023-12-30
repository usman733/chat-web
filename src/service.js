import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
  params: {},
});

export const getRooms = async () => {
    try {
      return await instance.get(`/api/rooms`);
    } catch (error) {
      throw error;
    }
  };
  
  export const getUsers = async () => {
    try {
      return await instance.get(`api/users`);
    } catch (error) {
      throw error;
    }
  };