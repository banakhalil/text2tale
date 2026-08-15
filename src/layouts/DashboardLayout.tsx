import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/Navbar/NavBar";
import useMediaQuery from "@/hooks/useMediaQuery";

const titleFromPath = (pathname: string) => {
  const segment = pathname.split("/")[1] ?? "";
  return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : "Dashboard";
};

const DashboardLayout = () => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const location = useLocation();

  const toggleSidebar = () => {
    if (isDesktop) {
      setExpanded((v) => !v);
    } else {
      setMobileOpen((v) => !v);
    }
  };

  return (
    <Flex h="100vh">
      <Box w={isDesktop && expanded ? "260px" : isDesktop ? "72px" : "0"} flexShrink={0}>
        <SideBar
          expanded={expanded}
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      </Box>

      <Flex direction="column" flex="1" overflow="hidden">
        <NavBar title={titleFromPath(location.pathname)} onToggleSidebar={toggleSidebar} />
        <Box flex="1" overflowY="auto" px={6} pb={6}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
