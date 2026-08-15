import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Subject {
  id: number;
  name: string;
  is_active: boolean;
}

interface SubjectsResponse {
  message: string;
  subjects: Subject[];
}

export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await axiosInstance.get<SubjectsResponse>("/subjects/");
      return response.data.subjects;
    },
  });
};

export const useAddSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("is_active", "true");
      const response = await axiosInstance.post("/subjects/add/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};

export const useDisableSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/subjects/${id}/delete/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};
