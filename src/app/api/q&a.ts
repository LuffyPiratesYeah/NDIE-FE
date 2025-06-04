import axiosInstance from "@/lib/axiosInstance";

export const CreateQA = async (data: { "title": string, "content": string }) => {
  const res = await axiosInstance.post('/api/QNA', data);
  return res.data;
};