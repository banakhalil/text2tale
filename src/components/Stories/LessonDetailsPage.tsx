import { Badge, Box, Grid, GridItem, HStack, IconButton, Skeleton, Text, VStack } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useLessonDetails } from "@/hooks/useStories";
import ExpandableText from "@/components/ExpandableText";
import { getStarColor } from "@/lib/starColors";

interface Props {
  lessonId: number;
  onBack: () => void;
}

const DetailsSkeleton = () => (
  <VStack align="stretch" gap={4}>
    <Skeleton height="100px" borderRadius="xl" bgColor="gray.300" _dark={{ bgColor: "gray.800" }} />
    <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
      {Array.from({ length: 2 }).map((_, i) => (
        <GridItem key={i}>
          <Skeleton height="180px" borderRadius="xl" bgColor="gray.300" _dark={{ bgColor: "gray.800" }} />
        </GridItem>
      ))}
    </Grid>
  </VStack>
);

const LessonDetailsPage = ({ lessonId, onBack }: Props) => {
  const { data: lesson, isLoading } = useLessonDetails(lessonId);

  return (
    <Box>
      <HStack mb={6}>
        <IconButton variant="ghost" aria-label="Go back" onClick={onBack}>
          <ArrowLeft />
        </IconButton>
        <Text fontWeight="bold" fontSize="lg">
          Lesson Details
        </Text>
      </HStack>

      {isLoading || !lesson ? (
        <DetailsSkeleton />
      ) : (
        <VStack align="stretch" gap={6}>
          <Box className="card" borderRadius="xl" p={4}>
            <HStack justify="space-between" mb={2}>
              <Badge fontSize="sm" bg="blue.50" color="blue.700" _dark={{ bg: "blue.950", color: "blue.200" }}>
                {lesson.subject_name}
              </Badge>
              <Text fontSize="sm" color="gray.500">
                {new Date(lesson.created_at).toLocaleDateString()}
              </Text>
            </HStack>
            <Text fontSize="md" color="gray.500" mb={2}>
              By {lesson.customer_name}
            </Text>
            <ExpandableText text={lesson.content} lines={4} />
          </Box>

          <Text fontWeight="semibold" fontSize="lg">
            Stories ({lesson.stories.length})
          </Text>

          {!lesson.stories.length ? (
            <Text color="gray.500" textAlign="center" py={10}>
              No stories generated yet
            </Text>
          ) : (
            <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
              {lesson.stories.map((story) => (
                <GridItem key={story.id}>
                  <Box className="card" borderRadius="xl" p={4} height="full">
                    <HStack justify="space-between" mb={1}>
                      <Text fontWeight="medium" fontSize="md" dir="rtl">
                        {story.title}
                      </Text>
                      {story.initial_rating !== null && (
                        <HStack gap={0}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              size={12}
                              color={getStarColor(i, story.initial_rating!)}
                            />
                          ))}
                        </HStack>
                      )}
                    </HStack>
                    <ExpandableText text={story.content} lines={3} />
                    {story.review_comment && (
                      <Box mt={3} pt={3} borderTopWidth="1px">
                        <Text fontSize="sm" fontWeight="medium" color="gray.500" mb={1}>
                          Review
                        </Text>
                        <Text fontSize="md" fontStyle="italic" dir="rtl" textAlign="right">
                          "{story.review_comment}"
                        </Text>
                      </Box>
                    )}
                  </Box>
                </GridItem>
              ))}
            </Grid>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default LessonDetailsPage;
