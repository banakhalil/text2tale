import { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LuSearch } from "react-icons/lu";
import { useUsers, type AppUser } from "@/hooks/useUsers";
import UserCard from "@/components/Users/UserCard";
import UserDetailsPage from "@/components/Users/UserDetailsPage";

type StatusFilter = "all" | "active" | "inactive";

const PAGE_SIZE = 12;

const UserCardSkeleton = () => (
  <Box className="card" borderRadius="2xl" p={4}>
    <VStack gap={3}>
      <Skeleton
        boxSize="80px"
        borderRadius="full"
        bgColor="gray.300"
        _dark={{ bgColor: "gray.800" }}
      />
      <SkeletonText noOfLines={2} width="80%" mx="auto" bgColor="gray.300" _dark={{ bgColor: "gray.800" }} />
    </VStack>
  </Box>
);

const Users = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  const isActive = statusFilter === "all" ? undefined : statusFilter === "active";
  const { data, isLoading } = useUsers(search, isActive, page);

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateStatusFilter = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  if (selectedUser) {
    return (
      <Box m={6}>
        <UserDetailsPage user={selectedUser} onBack={() => setSelectedUser(null)} />
      </Box>
    );
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.count / PAGE_SIZE)) : 1;

  return (
    <Box m={6}>
      <VStack align="stretch" gap={4} mb={6}>
        <InputGroup startElement={<LuSearch />} maxW="sm">
          <Input
            placeholder="Search by first name"
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            borderColor="gray.400"
            _dark={{ borderColor: "gray.600" }}
          />
        </InputGroup>

        <ButtonGroup size="sm" attached>
          <Button
            variant="outline"
            className={statusFilter === "all" ? "color-blue-solid" : "color-blue-outline"}
            onClick={() => updateStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant="outline"
            className={statusFilter === "active" ? "color-blue-solid" : "color-blue-outline"}
            onClick={() => updateStatusFilter("active")}
          >
            Active
          </Button>
          <Button
            variant="outline"
            className={statusFilter === "inactive" ? "color-blue-solid" : "color-blue-outline"}
            onClick={() => updateStatusFilter("inactive")}
          >
            Inactive
          </Button>
        </ButtonGroup>
      </VStack>

      {isLoading ? (
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <GridItem key={i}>
              <UserCardSkeleton />
            </GridItem>
          ))}
        </Grid>
      ) : !data?.users.length ? (
        <Box textAlign="center" py={20}>
          <Text fontSize="xl" fontWeight="bold" color="gray.500">
            No users found
          </Text>
        </Box>
      ) : (
        <>
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
            {data.users.map((user) => (
              <GridItem key={user.id}>
                <UserCard user={user} onClick={() => setSelectedUser(user)} />
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

export default Users;
