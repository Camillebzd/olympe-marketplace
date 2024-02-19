import React, { useState } from "react";
import { Box, Container, Flex, Heading, Input, InputGroup, InputLeftAddon, Stack, Text } from "@chakra-ui/react";
import NFTGrid from "../components/NFTGrid";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";
import { SmartContract, Web3Button, useContract, useNFTs } from "@thirdweb-dev/react";
import EtherlinkGenerator from "../const/EtherlinkGenerator.json";

const CONTRACT_ABI = EtherlinkGenerator.abi;

export default function Mint() {
  // const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const [logoColor, setLogoColor] = useState("B6FEDA");
  const [backgroundColor, setBackgroundColor] = useState("000000");

  const mintNFT = async (contract: SmartContract) => {
    await contract?.call(
      "safeMint",
      [
        "#" + logoColor,
        "#" + backgroundColor
      ]
    );

    const result = await contract?.call(
      "totalSupply"
    );
    console.log("RESULT:", result);
  };

  const EtherlinkSVGRender = () => {
    return (
      <Box borderRadius={"4px"} overflow={"hidden"}>
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
          width="300" height="300" viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet" style={{ backgroundColor: `#${logoColor}` }} >

          <g transform="translate(0.000000,400.000000) scale(0.100000,-0.100000)"
            fill={`#${backgroundColor}`} stroke="none">
            <path d="M0 2000 l0 -2000 2000 0 2000 0 0 2000 0 2000 -2000 0 -2000 0 0
-2000z m2265 1801 c154 -27 188 -36 327 -82 293 -97 615 -309 806 -529 229
-264 360 -533 434 -894 30 -150 31 -437 0 -598 -45 -237 -133 -470 -249 -658
-335 -542 -942 -882 -1573 -883 -234 0 -419 31 -618 102 -146 52 -219 86 -342
161 -411 247 -687 590 -830 1030 -145 445 -109 919 100 1330 76 149 136 240
231 355 148 177 340 338 542 452 161 91 415 178 626 213 151 26 401 26 546 1z"/>
            <path d="M1840 3473 c-145 -15 -351 -74 -495 -142 -182 -87 -322 -188 -465
-337 -246 -258 -383 -579 -397 -935 -16 -411 113 -762 400 -1081 187 -210 512
-392 805 -453 260 -54 567 -33 817 55 500 177 865 594 980 1120 22 101 31 374
16 482 -87 603 -512 1077 -1121 1248 -148 41 -379 60 -540 43z m1010 -504 c71
-35 120 -112 120 -186 0 -93 -8 -104 -258 -356 -255 -256 -296 -287 -381 -287
-81 1 -174 62 -200 133 -16 41 -13 132 5 175 17 41 444 478 503 514 62 39 143
42 211 7z m-700 10 c103 -16 224 -61 228 -83 3 -13 -33 -56 -119 -142 l-124
-124 -112 0 c-137 0 -221 -18 -331 -71 -143 -69 -250 -188 -310 -347 -24 -62
-26 -81 -27 -235 l-2 -168 -123 -124 c-68 -69 -129 -125 -137 -125 -18 0 -58
91 -86 190 -30 111 -30 382 1 492 121 438 522 743 982 747 52 0 124 -4 160
-10z m780 -611 c40 -86 58 -163 71 -294 38 -417 -188 -807 -572 -988 -163 -77
-393 -112 -570 -87 -141 21 -259 63 -259 94 0 7 57 66 126 132 l127 119 131 1
c114 1 141 5 207 28 228 78 372 235 430 467 18 71 21 102 16 185 -4 55 -9 110
-13 122 -5 18 16 44 125 152 71 72 135 131 141 131 6 0 24 -28 40 -62z m-1160
-562 c65 -43 94 -96 94 -174 1 -55 -4 -75 -26 -112 -38 -64 -484 -505 -530
-524 -103 -43 -232 6 -286 109 -23 44 -21 141 4 188 30 56 478 505 528 528 60
29 161 21 216 -15z"/>
          </g>
        </svg>
      </Box>
    );
  };

  return (
    <Container maxW={"1200px"} p={5}>
      <Heading>Mint new NFTs</Heading>
      <Text>Choose the colors and mint a new NFTs.</Text>
      <Flex direction={"column"} justifyContent={"center"} alignItems={"center"} mt={1}>
        {EtherlinkSVGRender()}
        <Flex direction={"column"} mt={2} mb={2}>
          <Text as='b'>Logo color</Text>
          <InputGroup flexDirection={"row"}>
            <InputLeftAddon>#</InputLeftAddon>
            <Input
              width={"auto"}
              defaultValue={logoColor}
              type={"text"}
              onChange={(e) => setLogoColor(e.target.value)}
            />
          </InputGroup>
        </Flex>
        <Flex direction={"column"} mb={8}>
          <Text as='b'>Background color</Text>
          <InputGroup flexDirection={"row"}>
            <InputLeftAddon>#</InputLeftAddon>
            <Input
              width={"auto"}
              defaultValue={backgroundColor}
              type={"text"}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </InputGroup>
        </Flex>
        <Web3Button
          style={{ width: 'fit-content' }}
          contractAddress={NFT_COLLECTION_ADDRESS}
          contractAbi={CONTRACT_ABI}
          action={async (contract) => {
            await mintNFT(contract);
          }}
          onSuccess={(txResult) => {
            // router.push(`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`);
          }}
        >Mint NFT</Web3Button>
      </Flex>

      {/* <NFTGrid 
        isLoading={isLoading} 
        data={data} 
        emptyText={"No NFTs found"}
      /> */}
    </Container>
  )
};