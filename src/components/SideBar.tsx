import { createContext, useContext } from "react";
import { Drawer, Portal, Text, useBreakpointValue } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  BookOpenText,
  LibraryBig,
  NotebookText,
  Users as UsersIcon,
} from "lucide-react";

interface SidebarProps {
  expanded: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/subjects", label: "Subjects", icon: LibraryBig },
  { to: "/users", label: "Users", icon: UsersIcon },
  { to: "/stories", label: "Stories", icon: NotebookText },
];

interface SidebarContextType {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType>({ expanded: true });

const SidebarContent = ({ expanded }: { expanded: boolean }) => (
  <>
    <br />
    <div className="py-8 flex justify-center items-center">
      <div className="px-2 flex justify-center items-center">
        <BookOpenText size={38} color="#bedbff" />
        {expanded && (
          <Text
            className="font-oswald"
            paddingX="1"
            ml={1}
            fontWeight="bold"
            fontSize="2xl"
            color="rgb(245, 244, 244)"
          >
            text2tale
          </Text>
        )}
      </div>
    </div>
    <br />

    <SidebarContext.Provider value={{ expanded }}>
      <ul
        className={`flex-1 px-4 flex flex-col ${
          !expanded && "items-center gap-4"
        } mt-6`}
      >
        {navItems.map((item) => (
          <SideBarItem key={item.to} {...item} />
        ))}
      </ul>
    </SidebarContext.Provider>
  </>
);

interface SideBarItemProps {
  to: string;
  label: string;
  icon: typeof BarChart3;
}

const SideBarItem = ({ to, label, icon: Icon }: SideBarItemProps) => {
  const { expanded } = useContext(SidebarContext);

  return (
    <li title={label} style={{ fontWeight: "bold" }}>
      <NavLink
        to={to}
        title={label}
        className={({ isActive }) =>
          `relative flex items-center justify-around my-0.5
          font-medium rounded-md cursor-pointer font-oswald
          transition-all duration-300 ease-in-out sidebar-text-color
          ${expanded ? "h-12 py-2 mx-10" : "h-9 w-9 p-1.5 justify-center"}
          ${isActive ? "sidebar-selected-item" : "sidebar-not-selected-item"}`
        }
      >
        <div
          className={`flex items-center justify-center ${
            expanded ? "ml-4" : "w-full h-full"
          }`}
        >
          <Icon size={20} />
        </div>
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3 p-4" : "w-0"
          }`}
        >
          {label}
        </span>
      </NavLink>
    </li>
  );
};

export default function SideBar({ expanded, isOpen, onClose }: SidebarProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isMobile) {
    return (
      <Drawer.Root
        placement="start"
        open={isOpen}
        onOpenChange={() => onClose()}
      >
        <Portal>
          <Drawer.Backdrop backdropBlur="10" />
          <Drawer.Positioner>
            <Drawer.Content className="sidebar-color">
              <Drawer.Header />
              <Drawer.Body>
                <SidebarContent expanded />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    );
  }

  return (
    <aside className="h-full">
      <nav className="h-full flex flex-col sidebar-color border-r shadow-sm rounded-sm">
        <SidebarContent expanded={expanded} />
      </nav>
    </aside>
  );
}
