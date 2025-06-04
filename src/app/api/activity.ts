import axiosInstance from "@/lib/axiosInstance";

export const CreateActivity = async (data: { title: string, content: string , image: string}) => {
  const res = await axiosInstance.post('/api/activity', data);
  return res.data;
};