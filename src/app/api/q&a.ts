import axiosInstance from "@/lib/axiosInstance";

export const CreateQA = async (data: { "title": string, "content": string }) => {
  const res = await axiosInstance.post('/QNA', data);
  if (res.status === 200) {
    return res.status;
  }
};