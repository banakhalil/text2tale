import { Badge, Box, HStack, Text } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import type { StoryListLesson } from "@/hooks/useStories";
import TruncatedText from "@/components/TruncatedText";
import { getStarColor } from "@/lib/starColors";

const CARD_HEIGHT = "340px";

interface Props {
  lesson: StoryListLesson;
  onClick: () => void;
}

const StoryCard = ({ lesson, onClick }: Props) => {
  return (
    <Box
      className="card"
      borderRadius="xl"
      p={4}
      height={CARD_HEIGHT}
      overflow="hidden"
      cursor="pointer"
      borderWidth={2}
      borderColor="transparent"
      transition="all 0.2s ease"
      _hover={{ borderColor: "#1944a0", transform: "translateY(-1px)", shadow: "lg" }}
      onClick={onClick}
    >
      <HStack justify="space-between" mb={2}>
        <Badge fontSize="sm" bg="blue.50" color="blue.700" _dark={{ bg: "blue.950", color: "blue.200" }}>
          {lesson.subject_name}
        </Badge>
        <Text fontSize="sm" color="gray.500">
          {new Date(lesson.created_at).toLocaleDateString()}
        </Text>
      </HStack>
      <TruncatedText text={lesson.content} lines={3} />
      <Text fontSize="sm" color="gray.500" mt={2}>
        {lesson.total_stories} stories generated
      </Text>

      <Box mt={3} pt={3} borderTopWidth="1px">
        {lesson.first_story ? (
          <>
            <HStack justify="space-between" mb={1}>
              <Text fontWeight="medium" fontSize="md" dir="rtl">
                {lesson.first_story.title}
              </Text>
              <HStack gap={0}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    size={12}
                    color={getStarColor(i, lesson.first_story!.initial_rating)}
                  />
                ))}
              </HStack>
            </HStack>
            <TruncatedText text={lesson.first_story.content} lines={3} />
          </>
        ) : (
          <Text fontSize="sm" color="gray.500">
            No story generated yet
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default StoryCard;
