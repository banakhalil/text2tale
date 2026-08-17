import { Avatar, Badge, Card, Text, VStack } from "@chakra-ui/react";
import type { AppUser } from "@/hooks/useUsers";

interface Props {
  user: AppUser;
  onClick: () => void;
}

const UserCard = ({ user, onClick }: Props) => {
  const fullName = `${user.first_name} ${user.last_name}`.trim() || user.email;

  return (
    <Card.Root
      className="card"
      borderRadius="2xl"
      p={4}
      position="relative"
      cursor="pointer"
      borderWidth={2}
      borderColor="transparent"
      transition="all 0.2s ease"
      _hover={{ borderColor: "#1944a0", transform: "translateY(-1px)", shadow: "lg" }}
      onClick={onClick}
    >
      {user.is_active ? (
        <Badge position="absolute" top={2} right={2} fontSize="xs" colorPalette="green">
          Active
        </Badge>
      ) : (
        <Badge
          position="absolute"
          top={2}
          right={2}
          fontSize="xs"
          bg="yellow.50"
          color="yellow.700"
          _dark={{ bg: "yellow.950", color: "yellow.200" }}
        >
          Inactive
        </Badge>
      )}
      <VStack gap={3}>
        <Avatar.Root size="xl" bg="gray.300" _dark={{ bg: "gray.700" }}>
          <Avatar.Fallback name={fullName} />
          {user.profile_image && <Avatar.Image src={user.profile_image} />}
        </Avatar.Root>
        <VStack gap={0}>
          <Text fontWeight="semibold" fontSize="md" textAlign="center">
            {fullName}
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            {user.email}
          </Text>
        </VStack>
      </VStack>
    </Card.Root>
  );
};

export default UserCard;
