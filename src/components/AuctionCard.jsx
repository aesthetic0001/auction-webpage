import {useState} from "react";
import Image from "next/image";
import {intToString, toDHMS} from "@/utils/number";

export function SelectedAuctionContext({children}) {
    const [selectedAuction, setSelectedAuction] = useState(null);

    return (
        <SelectedAuctionContext.Provider value={{selectedAuction, setSelectedAuction}}>
            {children}
        </SelectedAuctionContext.Provider>
    );
}

export function AuctionCard({auction}) {
    const {name, uuid, auctionUUID, category, state, metadata} = auction;
    // todo: relist button, expand button, and open button
    return (
        <div className="flex flex-col gap-2 bg-card border-2 border-white/10 p-3 rounded-lg bg-opacity-50 flex-shrink-0">
            <div className="flex flex-row items-center justify-items-center gap-3">
                <Image src={
                    `https://sky.coflnet.com/static/icon/${metadata.item_id}`
                } width={64} height={64} alt={name} className="border-2 border-white/10 shadow-md p-2 rounded-3xl"/>
                <h1 className="text-primary text-md">{name}</h1>
            </div>
            <h2 className="text-gray-500 text-sm">{`Listed for: ${intToString(metadata.starting_bid)}`}</h2>
            <h2 className="text-gray-500 text-sm">{`Ends in: ${toDHMS((metadata.auction_end - Date.now()) / 1000)}`}</h2>
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
