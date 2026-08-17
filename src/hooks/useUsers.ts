import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AppUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  role: string;
  security_key: number;
  is_active: boolean;
}

interface UsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    message: string;
    total_users: number;
    users: AppUser[];
  };
}

export const useUsers = (search: string, isActive?: boolean, page = 1) => {
  return useQuery({
    queryKey: ["users", search, isActive, page],
    queryFn: async () => {
      const params: Record<string, string> = { page_size: "12", page: String(page) };
      if (search) params.first_name = search;
      if (isActive !== undefined) params.is_active = String(isActive);

      const response = await axiosInstance.get<UsersResponse>("/users/all/", {
        params,
      });
      return {
        ...response.data.results,
        count: response.data.count,
        hasNext: response.data.next !== null,
        hasPrevious: response.data.previous !== null,
      };
    },
  });
};

export interface Story {
  id: number;
  title: string;
  content: string;
  initial_rating: number;
}

export interface Lesson {
  id: number;
  subject_id: number;
  subject_name: string;
  content: string;
  total_stories: number;
  first_story: Story | null;
  created_at: string;
}

export interface UserDetails {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  lessons: Lesson[];
}

interface UserDetailsResponse {
  message: string;
  user: UserDetails;
}

export const useUserDetails = (userId: number | null, subjectId?: number) => {
  return useQuery({
    queryKey: ["userDetails", userId, subjectId],
    queryFn: async () => {
      const response = await axiosInstance.get<UserDetailsResponse>(
        `/users/${userId}/details/`,
        { params: subjectId ? { subject_id: subjectId } : undefined },
      );
      return response.data.user;
    },
    enabled: userId !== null,
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await axiosInstance.patch(`/users/${id}/toggle-status/`, {
        is_active: isActive,
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userDetails", variables.id] });
    },
  });
};
