import React from "react";
import { Container, Heading, Text } from "@chakra-ui/react";
import { useCustomListing } from "../hooks/custom";
import ListingGrid from "../components/ListingGrid";

export default function Buy() {
  const { data: listing, isLoading } = useCustomListing();

  return (
    <Container maxW={"1200px"} p={5}>
      <Heading>Buy NFTs</Heading>
      <Text>Browse and buy NFTs from this collection.</Text>
      <ListingGrid 
        isLoading={isLoading} 
        data={listing} 
        emptyText={"No NFTs for sale"}
      />
    </Container>
  )
};