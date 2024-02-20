import React from "react";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Web3Button, useContract, useCreateAuctionListing, useCreateDirectListing } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../const/addresses";
import { Box, Input, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useToast } from "@chakra-ui/react";

type Props = {
  nft: NFTType;
};

type DirectFormData = {
  nftContractAddress: string;
  tokenId: string;
  price: string;
  startDate: Date;
  endDate: Date;
};

//Add for Auction
type AuctionFormData = {
  nftContractAddress: string;
  tokenId: string;
  startDate: Date;
  endDate: Date;
  floorPrice: string;
  buyoutPrice: string;
};

export default function SaleInfo({ nft }: Props) {
  const router = useRouter();
  const toast = useToast();
  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  const { mutateAsync: createDirectListing } = useCreateDirectListing(marketplace);

  async function checkAndProvideApproval() {
    const hasApproval = await nftCollection?.call(
      "isApprovedForAll",
      [
        nft.owner,
        MARKETPLACE_ADDRESS
      ]
    );

    if (!hasApproval) {
      const txResult = await nftCollection?.call(
        "setApprovalForAll",
        [
          MARKETPLACE_ADDRESS,
          true
        ]
      );
      if (txResult) {
        console.log("Approval provided");
        toast({
          title: 'Approval succeeded.',
          description: "You successfully approved the Marketplace.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }  
    }
    return true;
  }

  const { register: registerDirect, handleSubmit: handleSubmitDirect } = useForm<DirectFormData>({
    defaultValues: {
      nftContractAddress: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
      price: "0",
      startDate: new Date(NaN), // represent empty date
      endDate: new Date(NaN), // represent empty date
    },
  });

  async function handleSubmissionDirect(data: DirectFormData) {
    await checkAndProvideApproval();
    // Recreate date type if string was passed
    data.startDate = new Date(data.startDate);
    data.endDate = new Date(data.endDate);
    const txResult = await createDirectListing({
      assetContractAddress: data.nftContractAddress,
      tokenId: data.tokenId,
      pricePerToken: data.price,
      startTimestamp: isNaN(data.startDate.getTime()) ? undefined : new Date(data.startDate),
      endTimestamp: isNaN(data.endDate.getTime()) ? undefined : new Date(data.endDate),
    });

    return txResult;
  }

  //Add for Auction
  const { mutateAsync: createAuctionListing } =
    useCreateAuctionListing(marketplace);

  const { register: registerAuction, handleSubmit: handleSubmitAuction } =
    useForm<AuctionFormData>({
      defaultValues: {
        nftContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        startDate: new Date(),
        endDate: new Date(),
        floorPrice: "0",
        buyoutPrice: "0",
      },
    });

  async function handleSubmissionAuction(data: AuctionFormData) {
    await checkAndProvideApproval();
    const txResult = await createAuctionListing({
      assetContractAddress: data.nftContractAddress,
      tokenId: data.tokenId,
      buyoutBidAmount: data.buyoutPrice,
      minimumBidAmount: data.floorPrice,
      startTimestamp: new Date(data.startDate),
      endTimestamp: new Date(data.endDate),
    });

    return txResult;
  }

  return (
    <Tabs>
      <TabList>
        <Tab>Direct</Tab>
        <Tab>Auction</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Stack spacing={8}>
            <Box>
              <Text>Listing starts on:</Text>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                {...registerDirect("startDate")}
              />
              <Text mt={2}>Listing ends on:</Text>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                {...registerDirect("endDate")}
              />
            </Box>
            <Box>
              <Text fontWeight={"bold"}>Price:</Text>
              <Input
                placeholder="0"
                size="md"
                type="number"
                {...registerDirect("price")}
              />
            </Box>
            <Web3Button
              contractAddress={MARKETPLACE_ADDRESS}
              action={async () => {
                await handleSubmitDirect(handleSubmissionDirect)();
              }}
              onSuccess={(txResult) => {
                toast({
                  title: 'Create direct listing succeeded.',
                  description: "you had successfully put your nft for sale using directly listing.",
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
                });
                router.push(`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`);
              }}
              onError={(error) => {
                toast({
                  title: 'Create direct listing failed.',
                  description: "Something went wrong during the creation of direct listing, see console for debug.",
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
                console.log("Error:", error);
              }}
            >Create Direct Listing</Web3Button>
          </Stack>
        </TabPanel>
        <TabPanel>
          <Stack spacing={8}>
            <Box>
              <Text>Listing starts on:</Text>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                {...registerAuction("startDate")}
              />
              <Text mt={2}>Listing ends on:</Text>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                {...registerAuction("endDate")}
              />
            </Box>
            <Box>
              <Text fontWeight={"bold"}>Starting bid from:</Text>
              <Input
                placeholder="0"
                size="md"
                type="number"
                {...registerAuction("floorPrice")}
              />
            </Box>
            <Box>
              <Text fontWeight={"bold"}>Buyout price:</Text>
              <Input
                placeholder="0"
                size="md"
                type="number"
                {...registerAuction("buyoutPrice")}
              />
            </Box>
            <Web3Button
              contractAddress={MARKETPLACE_ADDRESS}
              action={async () => {
                return await handleSubmitAuction(handleSubmissionAuction)();
              }}
              onSuccess={(txResult) => {
                toast({
                  title: 'Create auction succeeded.',
                  description: "You had successfully put your nft for sale using auction.",
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
                });
                router.push(`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`);
              }}
              onError={(error) => {
                toast({
                  title: 'Create auction failed.',
                  description: "Something went wrong during the creation of auction, see console for debug.",
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
                console.log("Error:", error);
              }}
            >Create Auction Listing</Web3Button>
          </Stack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}