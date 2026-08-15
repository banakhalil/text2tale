import { Avatar } from "@chakra-ui/react";

interface AvatarNavProps {
  name: string;
}

const AvatarNav = ({ name }: AvatarNavProps) => {
  return (
    <Avatar.Root size="sm" bg="gray.300" _dark={{ bg: "gray.700" }}>
      <Avatar.Fallback name={name} />
    </Avatar.Root>
  );
};

export default AvatarNav;
