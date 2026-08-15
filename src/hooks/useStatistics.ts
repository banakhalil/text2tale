import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface StoriesStatsResponse {
  message: string;
  total_stories: number;
  stories_by_subject: Record<string, number>;
}

export const useStoriesStats = () =>
  useQuery({
    queryKey: ["stats", "stories"],
    queryFn: async () => {
      const res = await axiosInstance.get<StoriesStatsResponse>(
        "/statistics/stories/",
      );
      return res.data;
    },
  });

export interface TopUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string | null;
  total_first_stories: number;
}

interface TopUsersResponse {
  message: string;
  top_users: TopUser[];
}

export const useTopUsersStats = () =>
  useQuery({
    queryKey: ["stats", "top-users"],
    queryFn: async () => {
      const res = await axiosInstance.get<TopUsersResponse>(
        "/statistics/top-users/",
      );
      return res.data.top_users;
    },
  });

export interface SubjectRating {
  name: string;
  total_stories: number;
  ratings: Record<"1" | "2" | "3" | "4" | "5", number>;
}

interface RatingsResponse {
  message: string;
  subjects: SubjectRating[];
}

export const useRatingsStats = () =>
  useQuery({
    queryKey: ["stats", "ratings"],
    queryFn: async () => {
      const res = await axiosInstance.get<RatingsResponse>(
        "/statistics/rating/",
      );
      return res.data.subjects;
    },
  });
