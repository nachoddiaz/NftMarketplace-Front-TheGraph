import {gql} from "@apollo/client"

const GET_ACTIVE_ITEMS= gql`
{
        activeItem(first: 5, where: { buyer: "0x000000000" }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`

export default GET_ACTIVE_ITEMS