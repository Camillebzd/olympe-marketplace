import { 
  DirectListingV3,
  EnglishAuction,
  useAddress,
  useContract,
  useValidDirectListings,
  useValidEnglishAuctions,
  useOwnedNFTs,
  NFT
} from "@thirdweb-dev/react";
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
  type Listing = {
    data: (DirectListingV3 | EnglishAuction)[],
    isLoading: boolean
  }
  const [ listing, setListing ] = useState<Listing>({data: [], isLoading: true});

  useEffect(() => {
    if (loadingAuction || loadingDirectListings)
      return;
    if (directListings && auctionListing) {
      setListing({data: [...directListings, ...auctionListing], isLoading: false});
    } else if (directListings) {
      setListing({data: directListings, isLoading: false});
    } else if (auctionListing) {
      setListing({data: auctionListing, isLoading: false});
    }
  }, [directListings, auctionListing, loadingDirectListings, loadingAuction]);

  return listing;
}

export function useSalableNFTs() {
  const {data: listing, isLoading: loadingList} = useCustomListing();
  const address = useAddress();
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { data: ownedNFTs, isLoading: loadingOwnedNFTs } = useOwnedNFTs(contract, address);

  type SalableNFT = {
    data: NFT[],
    isLoading: boolean
  }
  const [ salableNFTs, setSalableNFTs ] = useState<SalableNFT>({data: [], isLoading: true});

  useEffect(() => {
    if (loadingList || loadingOwnedNFTs)
      return;
    let salables = ownedNFTs?.filter((nft) => {
      if (listing.find((elem) => elem.tokenId === nft.metadata.id))
        return false;
      return true;
    });
    if (salables == undefined)
      salables = [];
    setSalableNFTs({data: salables, isLoading: false});
  }, [ownedNFTs, listing, loadingList, loadingOwnedNFTs]);

  return salableNFTs;
}