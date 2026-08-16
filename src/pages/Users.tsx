import { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Input,
  InputGroup,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { useUsers, type AppUser } from "@/hooks/useUsers";
import UserCard from "@/components/Users/UserCard";
import UserDetailsPage from "@/components/Users/UserDetailsPage";

type StatusFilter = "all" | "active" | "inactive";

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
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  const isActive = statusFilter === "all" ? undefined : statusFilter === "active";
  const { data, isLoading } = useUsers(search, isActive);

  if (selectedUser) {
    return (
      <Box m={6}>
        <UserDetailsPage user={selectedUser} onBack={() => setSelectedUser(null)} />
      </Box>
    );
  }

  return (
    <Box m={6}>
      <VStack align="stretch" gap={4} mb={6}>
        <InputGroup startElement={<LuSearch />} maxW="sm">
          <Input
            placeholder="Search by first name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            borderColor="gray.400"
            _dark={{ borderColor: "gray.600" }}
          />
        </InputGroup>

        <ButtonGroup size="sm" attached>
          <Button
            variant="outline"
            className={statusFilter === "all" ? "color-blue-solid" : "color-blue-outline"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant="outline"
            className={statusFilter === "active" ? "color-blue-solid" : "color-blue-outline"}
            onClick={() => setStatusFilter("active")}
          >
            Active
          </Button>
          <Button
            variant="outline"
            className={statusFilter === "inactive" ? "color-blue-solid" : "color-blue-outline"}
            onClick={() => setStatusFilter("inactive")}
          >
            Inactive
          </Button>
        </ButtonGroup>
      </VStack>

      {isLoading ? (
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
          {Array.from({ length: 4 }).map((_, i) => (
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
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
          {data.users.map((user) => (
            <GridItem key={user.id}>
              <UserCard user={user} onClick={() => setSelectedUser(user)} />
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Users;
