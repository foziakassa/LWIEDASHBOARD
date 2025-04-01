// import axiosInstance from "@/shared/utils/axios_instance";
import axiosInstance from "./axiosinstance";

const poster = (url: string, data: object) => axiosInstance.post(url, data).then((res) => res.data);

export default poster;