import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import type { AdminUser } from "@/shared/types";

interface ProfileResponse {
  message: string;
  user: AdminUser;
}

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response =
        await axiosInstance.get<ProfileResponse>("/get_profile/");
      return response.data.user;
    },
  });
};

interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_image?: File;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilePayload) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value);
      });

      const response = await axiosInstance.patch<ProfileResponse>(
        "/profile/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

// interface ChangePasswordPayload {
//   old_password: string;
//   new_password: string;
//   confirm_new_password: string;
//   security_code: number;
// }

// export const useUpdatePassword = () => {
//   return useMutation({
//     mutationFn: async (data: ChangePasswordPayload) => {
//       const response = await axiosInstance.post("/change_password/", data);
//       return response.data;
//     },
//   });
// };
