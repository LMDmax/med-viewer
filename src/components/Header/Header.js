/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from "react";
import {
  Text,
  Image,
  HStack,
  Avatar,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  useMediaQuery,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { Link as RouteLink, useLocation, useNavigate } from "react-router-dom";
import MedAIIcon from "../../static/Images/medAIicon.svg";

const CustomTooltip = ({ children, label, userName }) => {
  return (
    <Tooltip
      label={userName.length > 6 ? label : null}
      aria-label="A tooltip"
      zIndex={100}
    >
      {children}
    </Tooltip>
  );
};

const Header = ({
  userInfo,
  searchResponse,
  setSearchResponse,
  department,
  setSearchInput,
  searchInput,
  pageNumber,
  setPageNumber,
  setSearchSelectedData,
  searchSelectedData,
}) => {
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
    
  return (
    <Flex
      h={ifWidthLessthan1920 ? "44px" : "6.11vh"}
      // h="6.11%"
      minH="46px"
      w="100%"
      background="light.100"
      justifyContent="space-between"
      fontSize={ifWidthLessthan1920 ? "14px" : " 0.72916vw"}
      alignItems="center"
      color="#000"
    >
      <Flex alignItems="center">
        <Link
          // as={RouteLink}
        //   to={
        //     userInfo?.userType
        //       ? `/dashboard/${userInfo?.userType}`
        //       : "/dashboard"
        //   }
          _hover={{
            textDecoration: "none",
          }}
          _focus={{ outline: "none" }}
        >
          <HStack
            px={ifWidthLessthan1920 ? "16px" : "0.8333vw"}
            py={ifWidthLessthan1920 ? "15px" : "2.17vh"}
            h="100%"
          >
            <Link
            //   href={
            //     userInfo?.userType === "technologist" ? "/dashboard/cases" : "/"
            //   }
            >
              <Image src={MedAIIcon} />
            </Link>
          </HStack>
        </Link>
        {/* <HStack h="100%">
          {userInfo?.userType !== "technologist" && (
            <Button
              fontSize={ifWidthLessthan1920 ? "12px" : "14px"}
              fontWeight={activeScreen === "home" ? "600" : "500"}
              bgColor="inherit"
              // onClick={(e) => {
              //   // e.preventDefault();
              //   // setActiveScreen("home");
              //   // navigate("/dashboard/pathologist");
              //   localStorage.removeItem("caseNum");
              // }}
              onClick={() => {
                localStorage.removeItem("caseNum");
                handleLinkClick(`/dashboard/${userInfo?.userType}`);
                navigate("/");
                navigate(`/dashboard/${userInfo?.userType}`);
              }}
              _hover={{ bgColor: "inherit" }}
              color={
                activeLink === `/dashboard/${userInfo?.userType}`
                  ? "#1B75BC"
                  : "#000"
              }
              borderBottom={
                activeLink === `/dashboard/${userInfo?.userType}`
                  ? "2px solid #1B75BC"
                  : ""
              }
              borderRadius={0}
            >
              Home
            </Button>
          )}

          {userInfo?.userType !== "admin" && (
            <Button
              // onClick={(e) => {
              //   setActiveScreen("cases");
              //   navigate("/dashboard/cases");
              //   window.location.reload();
              // }}
              onClick={() => {
                handleLinkClick("/dashboard/cases");
                navigate("/dashboard/cases");
              }}
              fontSize={ifWidthLessthan1920 ? "12px" : "14px"}
              fontWeight={activeLink === "/dashboard/cases" ? "600" : "500"}
              bgColor="inherit"
              _hover={{ bgColor: "inherit" }}
              color={activeLink === "/dashboard/cases" ? "#1B75BC" : "#000"}
              borderBottom={
                activeLink === "/dashboard/cases" ? "2px solid #1B75BC" : ""
              }
              borderRadius={0}
            >
              Cases
            </Button>
          )}
          {userInfo?.userType !== "admin" && (
            <Button
              fontSize={ifWidthLessthan1920 ? "12px" : "14px"}
              fontWeight={activeLink === "chats" ? "600" : "500"}
              bgColor="inherit"
              onClick={() => {
                handleLinkClick("/chats");
                navigate("/chats");
              }}
              _hover={{ bgColor: "inherit" }}
              color={activeLink === "/chats" ? "#1B75BC" : "#000"}
              borderBottom={activeLink === "/chats" ? "2px solid #1B75BC" : ""}
              borderRadius={0}
            >
              Chats
            </Button>
          )}
        </HStack> */}
      </Flex>
    </Flex>
  );
};
export default Header;
