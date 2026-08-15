import { useState } from "react";
import { Button, HStack, Menu, Portal, Text } from "@chakra-ui/react";
import { PanelLeft, LogOut, User } from "lucide-react";
import type { MenuSelectionDetails } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useAuth } from "@/contexts/AuthContext";
import AvatarNav from "./AvatarNav";
import Profile from "./Profile";
// import Password from "./Password";

interface NavBarProps {
  onToggleSidebar: () => void;
  title: string;
}

const NavBar = ({ onToggleSidebar, title }: NavBarProps) => {
  const { user, clearAuthData } = useAuth();
  const [openDrawer, setOpenDrawer] = useState<"profile" | "password" | null>(
    null,
  );

  const handleSelect = (details: MenuSelectionDetails) => {
    if (details.value === "logout") {
      clearAuthData();
    } else if (details.value === "profile" || details.value === "password") {
      setOpenDrawer(details.value);
    }
  };

  return (
    <HStack padding="20px" justifyContent="space-between">
      <HStack>
        <Button variant="ghost" size="lg" padding="0" onClick={onToggleSidebar}>
          <PanelLeft />
        </Button>
        <Text className="font-oswald" fontWeight="bold" fontSize="xl">
          {title}
        </Text>
      </HStack>

      <HStack gap={4}>
        <ColorModeButton />
        <Menu.Root onSelect={handleSelect}>
          <Menu.Trigger asChild>
            <Button variant="ghost">
              {user && <AvatarNav name={user.email} />}
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="profile" fontWeight="medium">
                  <User size={16} />
                  Profile
                </Menu.Item>
                {/* <Menu.Item value="password" fontWeight="medium">
                  <KeyRound size={16} />
                  Change Password
                </Menu.Item> */}
                <Menu.Item value="logout" color="red.500" fontWeight="medium">
                  <LogOut size={16} />
                  Logout
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      <Profile
        isOpen={openDrawer === "profile"}
        onClose={() => setOpenDrawer(null)}
      />
      {/* <Password
        isOpen={openDrawer === "password"}
        onClose={() => setOpenDrawer(null)}
      /> */}
    </HStack>
  );
};

export default NavBar;
