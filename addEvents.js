const Moralis = require("moralis/node")
require("dotenv").config

const contractAddress = require("./constants/networkMapping.json")
let chainId = process.env.chainId || 31337
//If chainID is 31337, moralisChainID in the local enviroment it will be 1337, otherwise it will be 31337
let moralisChainId = chainId == "31337" ? "1337" : chainId
const contractAddresses = contractAddress[chainId][0]

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const appId = process.env.NEXT_PUBLIC_APP_ID
const masterKey = process.env.MASTER_KEY

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey })
    console.log(`Working with contract address: ${contractAddress}`)

    //configuration of the events listeners
    let itemLisedOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "ItemListed(address, address, uint256, uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
        contractAddresses,
        tableName: "Item_Listed",
    }
    let ItemBoughtOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "ItemBought(address, address, uint256, uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemBought",
            type: "event",
        },
        contractAddresses,
        tableName: "Item_Bought",
    }

    let ItemCanceledOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "ItemCanceled(address, address, uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ItemCanceled",
            type: "event",
        },
        contractAddress,
        tableName: "Item_Canceled",
    }

    const listedResponse = await Moralis.Cloud.run("wathContractEvent", itemLisedOptions, {
        useMasterKey: true,
    })
    const boughtResponse = await Moralis.Cloud.run("wathContractEvent", ItemBoughtOptions, {
        useMasterKey: true,
    })
    const cancelResponse = await Moralis.Cloud.run("wathContractEvent", ItemCanceledOptions, {
        useMasterKey: true,
    })

    if (listedResponse.success && boughtResponse.success && cancelResponse.success) {
        console.log("Success, database update with events")
    } else {
        console.log("Something wrong")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
