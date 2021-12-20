import React from "react";
import {
  Box,
  Circle,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
} from "@chakra-ui/react";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";
import instance from "../../axios.default";
import { useEffect, useState, useContext } from "react";
import { TempContext } from "../../context/TempContext";
import FormChangeProfileUser from "../../Form/FormChangeProfileUser";
import FormChangePassword from "../../Form/FormChangePassword";

const ProfileApp = () => {
  const [userLogin, setUserLogin] = useState([]);
  const [settings, setSettings] = useContext(TempContext);
  const [change, setChange] = useState(0);

  const fetchUserLogin = async () => {
    try {
      const result = await instance.get("/user/user_login");
      setUserLogin(result.data.data);
      setSettings({ ...settings, userLogin: result.data.data });
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserLogin();
  }, [change]);

  return (
    <>
      <Head>
        <title>E-ROR | Halaman Ubah Profil</title>
      </Head>
      <DashboardLayout>
        <Box px={["2", "6"]} pb="10">
          <Box>
            <Box
              borderRadius="xl"
              pt="64"
              pb="3"
              bg="#FFD202"
              position="relative"
            >
              <Box display="flex" justifyContent="center" alignItems="center">
                <Avatar
                  bg="orange.500"
                  color="white"
                  position="absolute"
                  mt="7"
                  boxShadow="lg"
                  name={settings.userLogin.nama_lengkap}
                  size="2xl"
                />
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  position="absolute"
                  mt="56"
                >
                  <Heading fontSize="lg">{userLogin.nama_lengkap}</Heading>
                  <Text fontSize="xl">{userLogin.username}</Text>
                </Box>
              </Box>
            </Box>

            <Box mt="28" px={["0", "8", "20"]} py="10">
              <Tabs isFitted>
                <TabList>
                  <Tab>Ganti Profile</Tab>
                  <Tab>Ganti Password</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <FormChangeProfileUser
                      changed={() => setChange(change + setChange)}
                    />
                  </TabPanel>
                  <TabPanel>
                    <FormChangePassword />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default ProfileApp;
