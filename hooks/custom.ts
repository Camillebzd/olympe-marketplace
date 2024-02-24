import { DirectListingV3, EnglishAuction, useContract, useNFTs, useValidDirectListings, useValidEnglishAuctions } from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS, MARKETPLACE_ADDRESS } from "../const/addresses";
import { useEffect, useState } from "react";

export function useCustomListing() {
  const { contract: marketplace, isLoading: loadingMarketplace } = 
  useContract(
    MARKETPLACE_ADDRESS, 
    "marketplace-v3"
  );

  // Direct listing
  const { data: directListings, isLoading: loadingDirectListings } = 
    useValidDirectListings(marketplace, { tokenContract: NFT_COLLECTION_ADDRESS});
  // English auction
  const { data: auctionListing, isLoading: loadingAuction } =
    useValidEnglishAuctions(marketplace, { tokenContract: NFT_COLLECTION_ADDRESS });

  // Both Direct listing and English auction
  const [ listing, setListing ] = useState<(DirectListingV3 | EnglishAuction)[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    if (loadingAuction || loadingDirectListings)
      return;
    if (directListings && auctionListing) {
      setListing([...directListings, ...auctionListing]);
    } else if (directListings) {
      setListing(directListings);
    } else if (auctionListing) {
      setListing(auctionListing);
    }
    setIsLoading(false);
  }, [directListings, auctionListing, loadingDirectListings, loadingAuction]);

  return {listing, isLoading};
}