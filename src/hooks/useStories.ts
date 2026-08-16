import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface FirstStory {
  id: number;
  title: string;
  content: string;
  initial_rating: number;
}

export interface StoryListLesson {
  id: number;
  subject_name: string;
  content: string;
  total_stories: number;
  first_story: FirstStory | null;
  created_at: string;
}

interface StoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    message: string;
    lessons: StoryListLesson[];
  };
}

export const useStories = () => {
  return useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const response = await axiosInstance.get<StoriesResponse>("/stories/");
      return response.data.results.lessons;
    },
  });
};

export interface StoryDetail {
  id: number;
  title: string;
  content: string;
  initial_rating: number | null;
  review_comment: string | null;
  created_at: string;
}

export interface LessonDetails {
  id: number;
  subject_name: string;
  content: string;
  customer_name: string;
  created_at: string;
  stories: StoryDetail[];
}

interface LessonDetailsResponse {
  message: string;
  lesson: LessonDetails;
}

export const useLessonDetails = (lessonId: number | null) => {
  return useQuery({
    queryKey: ["lessonDetails", lessonId],
    queryFn: async () => {
      const response = await axiosInstance.get<LessonDetailsResponse>(
        `/stories/${lessonId}/`,
      );
      return response.data.lesson;
    },
    enabled: lessonId !== null,
  });
};
