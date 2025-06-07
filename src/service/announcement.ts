import axios from "@/lib/axiosInstance";

export async function getAnnouncement() {
  const response = await axios.get("http://ndie-be-985895714915.europe-west1.run.app/announcement");
  return response.data;
}