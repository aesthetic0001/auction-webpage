import {createContext, useContext, useState} from "react";
import Image from "next/image";
import {intToString, toDHMS} from "@/utils/number";
import {GrPowerReset} from "react-icons/gr";
import {TbZoomScan} from "react-icons/tb";
import {FaExternalLinkAlt} from "react-icons/fa";
import {AnimatePresence, motion} from "framer-motion";
import Card from "@/components/Card";

export const ActiveAuctionContext = createContext(null);

export function SelectedAuctionContext({children}) {
    const [selectedAuction, setSelectedAuction] = useState(null);

    return (
        <ActiveAuctionContext.Provider value={{selectedAuction, setSelectedAuction}}>
            {children}
        </ActiveAuctionContext.Provider>
    );
}

export function AuctionCard({auction, sendMessage}) {
    const {name, auctionUUID, metadata} = auction;
    const {setSelectedAuction} = useContext(ActiveAuctionContext);

    const handleOpenLink = () => {
        window.open(`https://sky.coflnet.com/auction/${auctionUUID}`, "_blank");
    };

    const handleExpand = () => {
        console.log(`Expanding auction ${name} (${auction.auctionUUID})`);
        setSelectedAuction(auction.auctionUUID);
    };

    const handleRelist = () => {
        console.log(`Relisting auction ${name} (${auction.auctionUUID})`);
        sendMessage(JSON.stringify({
            type: "CPacketConsoleCommand",
            data: {
                command: `relist ${auctionUUID}`,
            }
        }))
        // could wait for message, but this is a simple solution
        setTimeout(() => {
            sendMessage(JSON.stringify({
                type: "CPacketConsoleCommand",
                data: {
                    command: `y`,
                }
            }))
        }, 500)
    };

    return (
        <div className="flex flex-col gap-2 bg-card/50 border-2 border-white/10 p-3 rounded-lg flex-shrink-0 relative">
            <div className="flex flex-row items-center justify-items-center gap-3">
                <Image
                    src={`https://sky.coflnet.com/static/icon/${metadata.item_id}`}
                    width={48}
                    height={48}
                    alt={name}
                    className="border-2 border-white/10 shadow-md p-2 rounded-3xl"
                />
                <h1 className="text-primary md:text-md">{name}</h1>
            </div>
            <h2 className="text-gray-500 md:text-sm">{`Listed for: ${intToString(metadata.starting_bid)}`}</h2>
            <h2 className="text-gray-500 md:text-sm">{`Ends in: ${toDHMS((metadata.auction_end - Date.now()) / 1000)}`}</h2>
            <div className="flex flex-row self-end gap-2">
                <button
                    onClick={handleRelist}
                    className="md:text-sm px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition hover:cursor-pointer"
                >
                    <GrPowerReset/>
                </button>
                <button
                    onClick={handleExpand}
                    className="md:text-sm px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition hover:cursor-pointer"
                >
                    <TbZoomScan/>
                </button>
                <button
                    onClick={handleOpenLink}
                    className="md:text-sm px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition hover:cursor-pointer"
                >
                    <FaExternalLinkAlt/>
                </button>
            </div>
        </div>
    );
}

export function ActiveAuctionDisplay({auctions}) {
    const {selectedAuction, setSelectedAuction} = useContext(ActiveAuctionContext);
    const auction = auctions[selectedAuction];

    return (
        <AnimatePresence>
            {
                auction &&
                <div className="fixed top-0 right-0 bg-black/40 backdrop-blur-sm h-screen w-full
                    flex justify-center items-center z-20"
                     onClick={() => setSelectedAuction(false)}
                >
                    <motion.div
                        className="w-[80%] md:w-[60%] relative max-h-[67%] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                        initial={{opacity: 0, y: -50}}
                        animate={{opacity: 1, y: 0}}
                        exit={{
                            opacity: 0, y: -50,
                            transition: {duration: 0.175, ease: "easeOut"}
                        }}
                    >
                        <Card>
                            <div className="flex flex-row items-center justify-items-center gap-3">
                                <Image
                                    src={`https://sky.coflnet.com/static/icon/${auction.metadata.item_id}`}
                                    width={64}
                                    height={64}
                                    alt={auction.name}
                                    className="border-2 border-white/10 shadow-md p-2 rounded-3xl"
                                />
                                <h1 className="text-primary md:text-xl">{auction.name}</h1>
                            </div>
                            <h2 className="text-gray-500 md:text-lg">Listed for: {intToString(auction.metadata.starting_bid)}</h2>
                            <h2 className="text-gray-500 md:text-lg">Estimated
                                profit: {intToString(auction.metadata?.profit || 0)} ({(auction.metadata?.profit_percent || 0).toFixed(2)}%)</h2>
                            <h2 className="text-gray-500 md:text-lg">Time to buy: {(auction.metadata?.total_time_to_buy || 0).toFixed(1)}ms</h2>
                            <h2 className="text-gray-500 md:text-lg">Auction ID: <a
                                className="text-tertiary hover:underline"
                                href={`https://sky.coflnet.com/auction/${auction.auctionUUID}`} target="_blank"
                                rel="noopener noreferrer">{auction.auctionUUID}</a></h2>

                            <h2 className="text-gray-500 md:text-lg">{`Ends in: ${toDHMS((auction.metadata.auction_end - Date.now()) / 1000)}`}</h2>
                        </Card>
                    </motion.div>
                </div>
            }
        </AnimatePresence>
    );
}
