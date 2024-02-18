'use client'
import { Avatar, Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import NextLink from 'next/link';
import NavItem from "./NavItem";
import { useEffect, useState } from "react";

const MENU_LIST = [
  { text: "Buy", href: "/buy" },
  { text: "Sell", href: "/sell" },
];

export function Navbar() {
  const address = useAddress();
  const [activeSection, setActiveSection] = useState("/");

  useEffect(() => {
    setActiveSection(window.location.pathname);
  });

  return (
    <Box maxW={"1200px"} m={"auto"} py={"10px"} px={"40px"}>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Link as={NextLink} href='/'>
          <Heading>Olympe</Heading>
        </Link>
        <Flex
          display={['none', 'none', 'flex', 'flex']}
          gap={'10px'}
        >
          {MENU_LIST.map(elem => <NavItem key={elem.text} text={elem.text} href={elem.href} isActive={activeSection === elem.href} />)}
        </Flex>
        <Flex dir={"row"} alignItems={"center"}>
          <ConnectWallet />
          {address && (
            <Link as={NextLink} href={`/profile/${address}`}>
              <Avatar src='https://bit.ly/broken-link' ml={"20px"} />
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  )
};