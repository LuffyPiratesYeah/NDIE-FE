// src/services/user.ts
import axios from "@/lib/axiosInstance"; // 커스텀 axios 인스턴스가 있다면

export async function getAnnouncement() {
  const response = await axios.get("http://ndie-be-985895714915.europe-west1.run.app/announcement");
  return response.data;
}