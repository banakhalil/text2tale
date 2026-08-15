import { useState } from "react";
import { AxiosError } from "axios";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Menu,
  Portal,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { HiSortAscending } from "react-icons/hi";
import { useUserDetails, useToggleUserStatus, type AppUser } from "@/hooks/useUsers";
import { useSubjects } from "@/hooks/useSubjects";
import ExpandableText from "@/components/ExpandableText";
import { toaster } from "@/components/ui/toaster";

interface Props {
  user: AppUser;
  onBack: () => void;
}

const DetailsSkeleton = () => (
  <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
    {Array.from({ length: 2 }).map((_, i) => (
      <GridItem key={i}>
        <Skeleton height="220px" borderRadius="xl" bgColor="gray.300" _dark={{ bgColor: "gray.800" }} />
      </GridItem>
    ))}
  </Grid>
);

const UserDetailsPage = ({ user, onBack }: Props) => {
  const [subjectId, setSubjectId] = useState<string>("");
  const [isActive, setIsActive] = useState(user.is_active);
  const { data: subjects } = useSubjects();
  const { data: details, isLoading } = useUserDetails(
    user.id,
    subjectId ? Number(subjectId) : undefined,
  );
  const toggleStatus = useToggleUserStatus();

  const activeSubjects = (subjects ?? []).filter((s) => s.is_active);
  const subjectOptions = [
    { label: "All Subjects", value: "" },
    ...activeSubjects.map((s) => ({ label: s.name, value: String(s.id) })),
  ];
  const selectedLabel = subjectOptions.find((o) => o.value === subjectId)?.label ?? "All Subjects";

  const fullName = `${user.first_name} ${user.last_name}`.trim() || user.email;

  const handleToggleStatus = () => {
    const nextStatus = !isActive;
    toggleStatus.mutate(
      { id: user.id, isActive: nextStatus },
      {
        onSuccess: () => {
          setIsActive(nextStatus);
          toaster.create({
            title: nextStatus ? "User activated" : "User deactivated",
            type: "success",
            duration: 3000,
            closable: true,
          });
        },
        onError: (error) => {
          toaster.create({
            title: "Error",
            description:
              error instanceof AxiosError
                ? (error.response?.data?.message ?? "Failed to update user status")
                : "Failed to update user status",
            type: "error",
            duration: 5000,
            closable: true,
          });
        },
      },
    );
  };

  return (
    <Box>
      <HStack mb={6}>
        <IconButton variant="ghost" aria-label="Go back" onClick={onBack}>
          <ArrowLeft />
        </IconButton>
        <Text fontWeight="bold" fontSize="lg">
          User Details
        </Text>
      </HStack>

      <HStack gap={8} mb={6} align="center">
        <Avatar.Root width="100px" height="100px" bg="gray.300" _dark={{ bg: "gray.700" }}>
          <Avatar.Fallback name={fullName} fontSize="2xl" />
          {user.profile_image && <Avatar.Image src={user.profile_image} />}
        </Avatar.Root>
        <VStack align="start" gap={1}>
          <Text fontWeight="bold" fontSize="lg">
            {fullName}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {user.email}
          </Text>
          <HStack gap={3}>
            {isActive ? (
              <Badge colorPalette="green">Active</Badge>
            ) : (
              <Badge bg="yellow.50" color="yellow.700" _dark={{ bg: "yellow.950", color: "yellow.200" }}>
                Inactive
              </Badge>
            )}
            <Button
              size="xs"
              colorPalette={isActive ? "red" : "green"}
              variant="subtle"
              loading={toggleStatus.isPending}
              onClick={handleToggleStatus}
            >
              {isActive ? "Deactivate" : "Activate"}
            </Button>
          </HStack>
        </VStack>
      </HStack>

      <HStack justify="space-between" mb={4}>
        <Text fontWeight="semibold" fontSize="lg">
          Lessons
        </Text>
        <Menu.Root onSelect={(d) => setSubjectId(d.value)}>
          <Menu.Trigger asChild>
            <Button
              variant="outline"
              size="sm"
              borderColor="gray.400"
              _dark={{ borderColor: "gray.600" }}
            >
              <HiSortAscending /> {selectedLabel}
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content minW="10rem" className="drawer">
                <Menu.RadioItemGroup
                  value={subjectId}
                  onValueChange={(d) => setSubjectId(d.value)}
                >
                  {subjectOptions.map((option) => (
                    <Menu.RadioItem key={option.value} value={option.value}>
                      {option.label}
                      <Menu.ItemIndicator />
                    </Menu.RadioItem>
                  ))}
                </Menu.RadioItemGroup>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      {isLoading ? (
        <DetailsSkeleton />
      ) : !details?.lessons.length ? (
        <Text color="gray.500" textAlign="center" py={10}>
          No lessons found
        </Text>
      ) : (
        <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
          {details.lessons.map((lesson) => (
            <GridItem key={lesson.id}>
              <Box className="card" borderRadius="xl" p={4} height="full">
                <HStack justify="space-between" mb={2}>
                  <Badge colorPalette="blue">{lesson.subject_name}</Badge>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(lesson.created_at).toLocaleDateString()}
                  </Text>
                </HStack>
                <ExpandableText text={lesson.content} lines={3} />
                <Text fontSize="xs" color="gray.500" mt={2}>
                  {lesson.total_stories} stories generated
                </Text>

                <Box mt={3} pt={3} borderTopWidth="1px">
                  {lesson.first_story ? (
                    <>
                      <HStack justify="space-between" mb={1}>
                        <Text fontWeight="medium" fontSize="sm">
                          {lesson.first_story.title}
                        </Text>
                        <HStack gap={0}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              size={12}
                              color={i < lesson.first_story!.initial_rating ? "rgb(255,192,0)" : "#d1d5db"}
                            />
                          ))}
                        </HStack>
                      </HStack>
                      <ExpandableText text={lesson.first_story.content} lines={3} />
                    </>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      No story generated yet
                    </Text>
                  )}
                </Box>
              </Box>
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UserDetailsPage;
