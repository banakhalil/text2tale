import { useState } from "react";
import { Box, Grid, GridItem, Skeleton, Text } from "@chakra-ui/react";
import { useStories } from "@/hooks/useStories";
import StoryCard from "@/components/Stories/StoryCard";
import LessonDetailsPage from "@/components/Stories/LessonDetailsPage";

const StoryCardSkeleton = () => (
  <Skeleton height="340px" borderRadius="xl" bgColor="gray.300" _dark={{ bgColor: "gray.800" }} />
);

const Stories = () => {
  const { data: lessons, isLoading } = useStories();
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  if (selectedLessonId !== null) {
    return (
      <Box m={6}>
        <LessonDetailsPage lessonId={selectedLessonId} onBack={() => setSelectedLessonId(null)} />
      </Box>
    );
  }

  return (
    <Box m={6}>
      {isLoading ? (
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
          {Array.from({ length: 3 }).map((_, i) => (
            <GridItem key={i}>
              <StoryCardSkeleton />
            </GridItem>
          ))}
        </Grid>
      ) : !lessons?.length ? (
        <Box textAlign="center" py={20}>
          <Text fontSize="xl" fontWeight="bold" color="gray.500">
            No stories found
          </Text>
        </Box>
      ) : (
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
          {lessons.map((lesson) => (
            <GridItem key={lesson.id}>
              <StoryCard lesson={lesson} onClick={() => setSelectedLessonId(lesson.id)} />
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Stories;
