import {useState} from "react";
import Image from "next/image";
import {intToString, toDHMS} from "@/utils/number";
import {GrPowerReset} from "react-icons/gr";
import {TbZoomScan} from "react-icons/tb";
import {FaExternalLinkAlt} from "react-icons/fa";

export function SelectedAuctionContext({children}) {
    const [selectedAuction, setSelectedAuction] = useState(null);

    return (
        <SelectedAuctionContext.Provider value={{selectedAuction, setSelectedAuction}}>
            {children}
        </SelectedAuctionContext.Provider>
    );
}

export function AuctionCard({ auction }) {
    const { name, auctionUUID, metadata } = auction;

    const handleOpenLink = () => {
        window.open(`https://sky.coflnet.com/auction/${auctionUUID}`, "_blank");
    };

    const handleExpand = () => {
        console.log("Expanding...");
    };

    const handleRelist = () => {
        console.log("Relisting...");
    };

    return (
        <div className="flex flex-col gap-2 bg-card border-2 border-white/10 p-3 rounded-lg bg-opacity-50 flex-shrink-0 relative">
            <div className="flex flex-row items-center justify-items-center gap-3">
                <Image
                    src={`https://sky.coflnet.com/static/icon/${metadata.item_id}`}
                    width={64}
                    height={64}
                    alt={name}
                    className="border-2 border-white/10 shadow-md p-2 rounded-3xl"
                />
                <h1 className="text-primary text-md">{name}</h1>
            </div>
            <h2 className="text-gray-500 text-sm">{`Listed for: ${intToString(metadata.starting_bid)}`}</h2>
            <h2 className="text-gray-500 text-sm">{`Ends in: ${toDHMS((metadata.auction_end - Date.now()) / 1000)}`}</h2>
            <div className="flex flex-row self-end gap-2">
                <button
                    onClick={handleRelist}
                    className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                    <GrPowerReset/>
                </button>
                <button
                    onClick={handleExpand}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                    <TbZoomScan/>
                </button>
                <button
                    onClick={handleOpenLink}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    <FaExternalLinkAlt/>
                </button>
            </div>
        </div>
    );
}


export function ActiveCardContainer({children}) {
    return (
        <div className="flex flex-col gap-2 bg-background p-2 rounded-lg">
            {/*    expand on auction details */}
        </div>
    );
}
