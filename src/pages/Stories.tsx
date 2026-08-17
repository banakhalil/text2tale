import { useState } from "react";
import { Box, Grid, GridItem, HStack, IconButton, Skeleton, Text } from "@chakra-ui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useStories } from "@/hooks/useStories";
import StoryCard from "@/components/Stories/StoryCard";
import LessonDetailsPage from "@/components/Stories/LessonDetailsPage";

const PAGE_SIZE = 6;

const StoryCardSkeleton = () => (
  <Skeleton height="340px" borderRadius="xl" bgColor="gray.300" _dark={{ bgColor: "gray.800" }} />
);

const Stories = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useStories(page);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  if (selectedLessonId !== null) {
    return (
      <Box m={6}>
        <LessonDetailsPage lessonId={selectedLessonId} onBack={() => setSelectedLessonId(null)} />
      </Box>
    );
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.count / PAGE_SIZE)) : 1;

  return (
    <Box m={6}>
      {isLoading ? (
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <GridItem key={i}>
              <StoryCardSkeleton />
            </GridItem>
          ))}
        </Grid>
      ) : !data?.lessons.length ? (
        <Box textAlign="center" py={20}>
          <Text fontSize="xl" fontWeight="bold" color="gray.500">
            No stories found
          </Text>
        </Box>
      ) : (
        <>
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
            {data.lessons.map((lesson) => (
              <GridItem key={lesson.id}>
                <StoryCard lesson={lesson} onClick={() => setSelectedLessonId(lesson.id)} />
              </GridItem>
            ))}
          </Grid>

          <HStack justify="center" gap={4} mt={8}>
            <IconButton
              aria-label="Previous page"
              size="sm"
              rounded="full"
              minW="40px"
              h="40px"
              boxShadow="md"
              className="color-blue-solid"
              disabled={!data.hasPrevious}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ArrowLeft size={18} />
            </IconButton>
            <Text fontSize="sm" color="gray.500">
              Page {page} of {totalPages}
            </Text>
            <IconButton
              aria-label="Next page"
              size="sm"
              rounded="full"
              minW="40px"
              h="40px"
              boxShadow="md"
              className="color-blue-solid"
              disabled={!data.hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              <ArrowRight size={18} />
            </IconButton>
          </HStack>
        </>
      )}
    </Box>
  );
};

export default Stories;
