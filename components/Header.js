import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 boerder-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
            <div>
                <Link href={"/"}>
                    <a>Home</a>
                </Link>
                <Link href={"/sell-nft"}>
                    <a>Sell NFT</a>
                </Link>
                <Link href={"/withdraw-income"}>
                    <a>Withdraw Sales</a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
            
        </nav>
    )
}