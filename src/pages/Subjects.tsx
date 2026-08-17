import { useState } from "react";
import { AxiosError } from "axios";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  GridItem,
  Skeleton,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useToggleSubjectStatus, useSubjects, type Subject } from "@/hooks/useSubjects";
import { getSubjectIcon } from "@/lib/subjectIcons";
import CreateSubject from "@/components/Subjects/CreateSubject";
import { toaster } from "@/components/ui/toaster";

const CARD_HEIGHT = "160px";

const SubjectCard = ({ subject }: { subject: Subject }) => {
  const Icon = getSubjectIcon(subject.id);
  const toggleStatus = useToggleSubjectStatus();

  const handleToggle = () => {
    const nextStatus = !subject.is_active;
    toggleStatus.mutate(subject.id, {
      onSuccess: () => {
        toaster.create({
          title: nextStatus ? "Subject enabled" : "Subject disabled",
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
              ? (error.response?.data?.message ??
                `Failed to ${nextStatus ? "enable" : "disable"} subject`)
              : `Failed to ${nextStatus ? "enable" : "disable"} subject`,
          type: "error",
          duration: 5000,
          closable: true,
        });
      },
    });
  };

  return (
    <Card.Root
      className="card"
      borderRadius="2xl"
      height={CARD_HEIGHT}
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={3}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={3}
        opacity={subject.is_active ? 1 : 0.5}
        filter={subject.is_active ? undefined : "grayscale(1)"}
      >
        <Icon size={36} className="color-teal-outline" />
        <Text fontWeight="medium" fontSize="lg" textAlign="center">
          {subject.name}
        </Text>
      </Box>
      <Button
        size="sm"
        variant="outline"
        colorPalette={subject.is_active ? "red" : "green"}
        loading={toggleStatus.isPending}
        onClick={handleToggle}
        _hover={
          subject.is_active
            ? undefined
            : { bg: "green.50", color: "green.700", _dark: { bg: "green.900", color: "green.200" } }
        }
      >
        {subject.is_active ? "Disable" : "Enable"}
      </Button>
    </Card.Root>
  );
};

const SubjectCardSkeleton = () => (
  <Card.Root
    className="card"
    borderRadius="2xl"
    height={CARD_HEIGHT}
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap={3}
  >
    <Skeleton
      boxSize="36px"
      borderRadius="md"
      bgColor="gray.300"
      _dark={{ bgColor: "gray.800" }}
    />
    <SkeletonText
      noOfLines={1}
      width="60%"
      mx="auto"
      bgColor="gray.300"
      _dark={{ bgColor: "gray.800" }}
    />
  </Card.Root>
);

const Subjects = () => {
  const { data: subjects, isLoading } = useSubjects();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <Box m={6}>
      <Flex justify="flex-end" mb={6}>
        <Button className="color-blue-solid" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} /> Add Subject
        </Button>
        <CreateSubject isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      </Flex>

      {isLoading ? (
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
          {Array.from({ length: 3 }).map((_, i) => (
            <GridItem key={i}>
              <SubjectCardSkeleton />
            </GridItem>
          ))}
        </Grid>
      ) : !subjects?.length ? (
        <Box textAlign="center" py={20}>
          <Text fontSize="xl" fontWeight="bold" color="gray.500">
            No subjects added yet
          </Text>
        </Box>
      ) : (
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
          {subjects.map((subject) => (
            <GridItem key={subject.id}>
              <SubjectCard subject={subject} />
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Subjects;
