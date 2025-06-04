import axiosInstance from "@/lib/axiosInstance";

export const CreateAnnouncement = async (data: { title: string, content: string}) => {
  const res = await axiosInstance.post('/api/announcement', data);
  return res.data;
};