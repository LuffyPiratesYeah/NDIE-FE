import axiosInstance from "@/lib/axiosInstance";

export const CreateActivity = async (data: { title: string, content: string , image: string}) => {
  const res = await axiosInstance.post('/activity', data);
  return res.data;
};

export const uploadImg = async (data: FormData) => {
  console.log(data)
  const res = await axiosInstance.post('/upload', data, {
    headers:{
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};