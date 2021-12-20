import { useState, useContext } from "react";
import { TempContext } from "../../context/TempContext";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  Button,
  Divider,
  useColorMode,
  Text,
  Link,
} from "@chakra-ui/react";
import { SettingsIcon, SunIcon, MoonIcon, BellIcon } from "@chakra-ui/icons";
import { Icon } from "@iconify/react";
import moment from "moment";
import "moment/locale/id";
import { useRouter } from "next/router";

const DashboardNavbar = () => {
  const router = useRouter();
  const NavbarMobile = "64px";
  const NavbarDesktop = "92px";

  const [settings, setSettings] = useContext(TempContext);

  const toggleSidebar = () => {
    setSettings({ ...settings, active: !settings.active });
  };

  return (
    <Box
      sx={{
        "--my-calculation":
          settings.bigMode === false
            ? "calc(100% - 280px)"
            : "calc(100% - 90px)",
      }}
      w={[
        "100%",
        "100%",
        "100%",
        "100%",
        "var(--my-calculation)",
        "var(--my-calculation)",
      ]}
      justifyContent="space-between"
      alignItems="center"
      height={[
        NavbarMobile,
        NavbarMobile,
        NavbarMobile,
        NavbarMobile,
        NavbarDesktop,
        NavbarDesktop,
      ]}
      bg={useColorMode().colorMode === "dark" ? "gray.800" : "white"}
      position="fixed"
      top="0"
      right="0"
      px="6"
      display="flex"
      zIndex="500"
    >
      <Button
        visibility={[
          "visible",
          "visible",
          "visible",
          "visible",
          "hidden",
          "hidden",
        ]}
        onClick={() => toggleSidebar()}
        zIndex="5000"
      >
        <Icon icon="ci:list-ul" width={24} height={24} />
      </Button>
    </Box>
  );
};

export default DashboardNavbar;
