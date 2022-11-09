/* Create a new table called ActiveItem
Add items that are listed in the marketplace
Delete items that are bougth*/

import Moralis from "moralis"

//afterSave do certain thinf when the event is fired
Moralis.Cloud.afterSave("ItemListed", async (request) => {
    //Every event gets triggered twice, once on unconformed and other with confirmed
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("looking for confirmed TX...")
    if (confirmed) {
        logger.info("Found Item")
        //If ActiveItem exists, grab it, if not, create it
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        query.equalTo("seller", request.object.get("seller"))
        const alreadyListed = await query.first()
        if (alreadyListed) {
            logger.info(`Deleting already listed: ${request.object.get("objectId")}`)
            await alreadyListed.destroy()
            logger.info(
                `Deleting Item with tokenId:${request.object.get(
                    "tokenId"
                )} at address:${request.object.get(
                    "nftAddress"
                )} because it has been already listed`
            )
        }

        const activeItem = new ActiveItem()
        activeItem.set("marketplaceAddress", request.object.get("address"))
        activeItem.set("nftAddress", request.object.get("nftAddress"))
        activeItem.set("price", request.object.get("price"))
        activeItem.set("tokenId", request.object.get("tokenId"))
        activeItem.set("seller", request.object.get("seller"))
        logger.info(
            `Adding Address: ${request.object.get("address")}. 
            tokenId:${request.object.get("tokenId")}`
        )
        logger.info("Saving...")
        await activeItem.save()
    }
})

Moralis.Cloud.afterSave("ItemBought", async (request) => {
    //Every event gets triggered twice, once on unconformed and other with confirmed
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object ${request.object}`)
    if (confirmed) {
        logger.info("Found Item")
        //If ActiveItem exists, grab it, if not, create it
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)

        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))

        logger.info(`Marketplace | Query ${query}`)
        const boughtItem = await query.first()
        if (boughtItem) {
            logger.info(`Deleting ${request.object.get("objectId")}`)
            await boughtItem.destroy()
            logger.info(`Deleting item with TokenId: ${request.object.get("tokenId")}
            at address ${request.object.get(address)}`)
        } else {
            logger.info(
                `No item found with address :${request.object.get(
                    "nftAddress"
                )} and tokenId : ${request.object.get("tokenId")}`
            )
        }
    }
})

Moralis.Cloud.afterSave("ItemCanceled", async (request) => {
    //Every event gets triggered twice, once on unconformed and other with confirmed
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object ${request.object}`)
    if (confirmed) {
        logger.info("Found Item")
        //If ActiveItem exists, grab it, if not, create it
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)

        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))

        logger.info(`Marketplace | Query ${query}`)
        //Fincd the Nft with the same address and tokenId and cancel it
        const canceledItem = await query.first()
        logger.info(`Marketplace | CanceledItem ${canceledItem}`)
        if (canceledItem) {
            logger.info(
                `Deleting: ${request.object.get("tokenId")}. 
                at address :${request.object.get("nftAddress")} cause it was canceled`
            )
            await canceledItem.destroy()
        } else {
            logger.info(
                `No item found with address :${request.object.get(
                    "nftAddress"
                )} and tokenId : ${request.object.get("tokenId")}`
            )
        }
    }
})
