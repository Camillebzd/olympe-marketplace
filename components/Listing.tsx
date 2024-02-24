import React from "react";
import { DirectListingV3, EnglishAuction } from "@thirdweb-dev/sdk";
import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";

type Props = {
  assetListing: DirectListingV3 | EnglishAuction;
};

export default function Listing({ assetListing }: Props) {
  return (
    <Flex direction={"column"} backgroundColor={"#EEE"} justifyContent={"center"} padding={"2.5"} borderRadius={"6px"} borderColor={"lightgray"} borderWidth={1}>
      <Box borderRadius={"4px"} overflow={"hidden"}>
        <ThirdwebNftMedia metadata={assetListing.asset} height={"100%"} width={"100%"} />
      </Box>
      <Text fontSize={"small"} color={"darkgray"}>Token ID #{assetListing.asset.id}</Text>
      <Text fontWeight={"bold"}>{assetListing.asset.name}</Text>

      <Box>
        {!assetListing ? (
          <Skeleton></Skeleton>
        ) : 'currencyValuePerToken' in assetListing ? (
          <Box>
            <Flex direction={"column"}>
              <Text fontSize={"small"}>Price</Text>
              <Text fontSize={"small"}>{`${assetListing?.currencyValuePerToken.displayValue} ${assetListing?.currencyValuePerToken.symbol}`}</Text>
            </Flex>
          </Box>
        ) : 'minimumBidCurrencyValue' in assetListing ? (
          <Box>
            <Flex direction={"column"}>
              <Text fontSize={"small"}>Minimum Bid</Text>
              <Text fontSize={"small"}>{`${assetListing?.minimumBidCurrencyValue.displayValue} ${assetListing?.minimumBidCurrencyValue.symbol}`}</Text>
            </Flex>
          </Box>
        ) : (
          <Box>
            <Flex direction={"column"}>
              <Text fontSize={"small"}>Price</Text>
              <Text fontSize={"small"}>Not Listed</Text>
            </Flex>
          </Box>
        )}
      </Box>
    </Flex>
  )
};