import { Avatar } from "@chakra-ui/react";

interface AvatarNavProps {
  name: string;
}

const AvatarNav = ({ name }: AvatarNavProps) => {
  return <Avatar.Root size="sm"><Avatar.Fallback name={name} /></Avatar.Root>;
};

export default AvatarNav;
