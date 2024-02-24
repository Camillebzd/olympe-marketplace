import type { DirectListingV3, EnglishAuction } from "@thirdweb-dev/sdk";
import { SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import Listing from "./Listing";

type Props = {
  isLoading: boolean;
  data: (DirectListingV3 | EnglishAuction)[] | undefined
  emptyText?: string;
};

export default function ListingGrid({
  isLoading,
  data,
  emptyText = "No NFTs for sale",
}: Props) {
  return (
    <SimpleGrid columns={4} spacing={6} w={"100%"} padding={2.5} my={5}>
      {isLoading ? (
        [...Array(20)].map((_, index) => (
          <Skeleton key={index} height={"312px"} width={"100%"} />
        ))
      ) : data && data.length > 0 ? (
        data.map((assetListing) => 
          <Link
            href={`/token/${assetListing.assetContractAddress}/${assetListing.tokenId}`}
            key={assetListing.id}
          >
            <Listing assetListing={assetListing} />
          </Link>
        )
      ) : (
        <Text>{emptyText}</Text>
      )}
    </SimpleGrid>
  )
};