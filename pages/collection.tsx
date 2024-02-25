import React from "react";
import { Container, Heading, Text } from "@chakra-ui/react";
import { useContract, useNFTs } from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";
import NFTGrid from "../components/NFTGrid";

export default function Collection() {
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { data, isLoading } = useNFTs(contract);

  return (
    <Container maxW={"1200px"} p={5}>
      <Heading>Browse collection</Heading>
      <Text>Browse all the NFTs minted of this collection.</Text>
      <NFTGrid
        isLoading={isLoading}
        data={data}
        emptyText={"The collection is empty for the moment"}
      />
    </Container>
  )
};