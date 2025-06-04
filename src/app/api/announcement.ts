import axiosInstance from "@/lib/axiosInstance";

export const CreateAnnouncement = async (data: { title: string, content: string}) => {
  const res = await axiosInstance.post('/announcement', data);
  return res.data;
};