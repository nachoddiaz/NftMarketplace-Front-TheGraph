//Modal means that someting pops up
//We take modal from web3uikit

import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { Modal, Input, useNotification } from "web3uikit"
import nftMarketplaceAbi from "constants/abi.jsonNftMarketplace"
import nftAbi from "constants/abi.jsonBasicNFT"
import { ethers } from "ethers"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    maketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification()

    const [priceToUpdateListing, setPriceToUpdateListing] = useState(0)

    const hadleUpdateLisintgSuccess = () =>{
        dispatch({
            type: "success",
            message:"listing updated",
            title: "Listing updated, please refresh",
            position:"topR"
        })
        onClose && onClose()
        setPriceToUpdateListing()
    }

    

    const { runContractFunction: updateLsting } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: maketplaceAddress,
        functionName: "updateLsting",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListing || "0"),
        },
    })


    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: maketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateLsting({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: hadleUpdateLisintgSuccess,
                })
            }}
        >
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListing(event.target.value)
                }}
            />
        </Modal>
    )
}
