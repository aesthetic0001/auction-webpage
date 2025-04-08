"use client";

import Card from "@/components/Card";
import {useEffect, useState} from "react";
import Image from "next/image";
import {intToString, toDHMS} from "@/utils/number";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {AuctionCard} from "@/components/AuctionCard";
import {FaRegPauseCircle, FaRegPlayCircle} from "react-icons/fa";
import {motion} from 'framer-motion';

function AccountCard({username, uuid, startDate, className}) {
    const elapsed = Math.floor((Date.now() - startDate) / 1000);
    return (
        <Card className={className}>
            <div className="flex flex-rows items-center justify-stretch gap-5 h-full w-full">
                <Image
                    src={`https://mc-heads.net/head/${uuid.replace(/-/g, '').trim()}.png`}
                    alt="Minecraft Head"
                    className="border-2 border-white/10 shadow-md p-2 rounded-3xl"
                    width={100}
                    height={100}
                />
                <div className="flex flex-col my-3">
                    <h2 className="text-md text-gray-400">Welcome Back</h2>
                    <h1 className="text-lg text-primary">{username}</h1>
                    <h2 className="text-md text-gray-500">{`${toDHMS(elapsed)} elapsed`}</h2>
                </div>
            </div>
        </Card>
    );
}

function QuickProfitCard({profit, profitThisHour, startDate, profitThisHourQueue, className}) {
    const elapsed = Math.floor((Date.now() - startDate) / 1000);
    return (
        <Card className={className}>
            <div className="flex flex-rows items-center justify-stretch gap-5 h-full w-full">
                <Image
                    src="/gold_block.png"
                    alt="Gold Block"
                    className="border-2 border-white/10 shadow-md p-2 rounded-3xl"
                    width={100}
                    height={100}
                />
                <div className="flex flex-col gap-1 my-3">
                    <h1 className="text-lg text-primary">{`Profit Stats`}</h1>
                    <h2 className="text-md text-gray-400 hover:text-accent transition-colors duration-200">{`Total Profit: ${intToString(profit)} coins (${intToString(profit * 3600 / Math.max(elapsed, 1))} coins/h)`}</h2>
                    <h2 className="text-md text-gray-400 hover:text-accent transition-colors duration-200">{`Profit This Hour: ${intToString(profitThisHour)} coins`}</h2>
                    {/*<h2 className="text-md text-gray-400 hover:text-accent transition-colors duration-200">{`Profit from Previous Flip: ${intToString(profitThisHourQueue[profitThisHourQueue.length - 1]?.profit || 0)} coins`}</h2>*/}
                </div>
            </div>
        </Card>
    );
}

function StateCard({state, purse, className}) {
    return (
        <Card className={className}>
            <div className="flex flex-col gap-1 h-full text-center items-center">
                <h1 className="text-lg text-primary">Bot State</h1>
                <h2 className="text-md text-gray-400 hover:text-accent transition-colors duration-200">{`Current State: ${state}`}</h2>
                <h2 className="text-md text-gray-400 hover:text-accent transition-colors duration-200">{`Purse Balance: ${purse}`}</h2>
                <div className="flex-grow"></div>
                <div className="grid grid-cols-2 gap-8 mb-3 w-fit">
                    <motion.button
                        className="flex items-center justify-center px-5 py-2 bg-error rounded-2xl hover:cursor-pointer"
                        whileHover={{
                            scale: 1.05
                        }}
                        whileTap={{
                            scale: 0.98
                        }}
                        transition={{
                            scale: {
                                ease: 'easeInOut',
                                duration: 0.1
                            }
                        }}
                    >
                        <FaRegPauseCircle className="text-lg"/>
                    </motion.button>
                    <motion.button
                        className="flex items-center justify-center px-5 py-2 bg-secondary rounded-2xl hover:cursor-pointer"
                        whileHover={{
                            scale: 1.05
                        }}
                        whileTap={{
                            scale: 0.98
                        }}
                        transition={{
                            scale: {
                                ease: 'easeInOut',
                                duration: 0.1
                            }
                        }}
                    >
                        <FaRegPlayCircle className="text-lg"/>
                    </motion.button>
                </div>
            </div>
        </Card>
    );
}

function ChatCard({messages, className, onMessage}) {
    const [message, setMessage] = useState("");

    return (
        <Card className={className}>
            <div className="flex flex-col h-full gap-1 justify-between">
                <div className="flex flex-col gap-1 my-3">
                    {messages.map((message, index) => (
                        <div key={index} className="flex flex-row gap-2">
                            <h1 className="text-primary">[{message.sender}]</h1>
                            <h2 className="text-gray-500">{message.message}</h2>
                        </div>
                    ))}
                </div>
                <div className="flex flex-row gap-2 justify-center">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border border-white/10 rounded-2xl px-5 py-2 bg-transparent text-white"
                        placeholder="Enter a command..."
                    />
                    <button
                        onClick={() => {
                            onMessage(message);
                            setMessage("");
                        }}
                        className="bg-secondary text-primary rounded-2xl p-2"
                    >
                        Send
                    </button>
                </div>
            </div>
        </Card>
    );
}

function AuctionsDisplayCard({auctions, className}) {
    return (
        <Card className={className}>
            <div className="flex flex-row items-center gap-3 h-full w-full overflow-x-scroll no-scrollbar">
                {Object.keys(auctions).map((auctionID, index) => {
                        const auction = auctions[auctionID]
                        return (
                            <AuctionCard key={index} auction={auction}/>
                        )
                    }
                )}
            </div>
        </Card>
    );
}

function GraphCard({data, className}) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    if (!isReady) return null;

    return (
        <Card className={className}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={100}
                    height={100}
                    data={data}
                    // margin={{top: 5, right: 30, left: 20, bottom: 5}}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="Profit" stroke="#8884d8" activeDot={{r: 8}}/>
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}

export default function Home() {
    const [username, setUsername] = useState(null);
    const [uuid, setUuid] = useState(null);
    const [startDate, setStartDate] = useState(Date.now());
    const [profit, setProfit] = useState(0);
    const [profitThisHour, setProfitThisHour] = useState(0);
    const [profitThisHourQueue, setProfitThisHourQueue] = useState([]);
    const [activeAuctions, setActiveAuctions] = useState({
        "23456789-2345-2345-2345-234567890123": {
            name: "Heroic Hyperion",
            uuid: "23456789-2345-2345-2345-234567890123",
            auctionUUID: "98765432-5432-5432-5432-321098765432",
            category: "BOUGHT",
            state: "AWAIT_SELL",
            metadata: {
                starting_bid: 1_600_000_000,
                auction_end: Date.now() + 7200000,
                item_id: "HYPERION"
            },
        },
        "34567890-3456-3456-3456-345678901234": {
            name: "Suspicious Scylla",
            uuid: "34567890-3456-3456-3456-345678901234",
            auctionUUID: "87654321-6543-6543-6543-210987654321",
            category: "BOUGHT",
            state: "AWAIT_SELL",
            metadata: {
                starting_bid: 1_600_000_000,
                auction_end: Date.now() + 3600000,
                item_id: "SCYLLA"
            },
        }
    });
    const [purse, setPurse] = useState(0);
    const [botState, setBotState] = useState("IDLE");

    return (
        <div className="h-screen p-8 box-border overflow-hidden">
            <main className="grid grid-cols-10 grid-rows-10 gap-4 h-full max-h-full">
                <AccountCard
                    username={username || "aesthetic0001"}
                    uuid={uuid || "04d4147f0bce4f03a8c2b71884680136"}
                    startDate={startDate}
                    className="col-span-2 row-span-2"
                />
                <QuickProfitCard
                    profit={profit}
                    profitThisHour={profitThisHour}
                    startDate={startDate}
                    profitThisHourQueue={profitThisHourQueue}
                    className="col-span-2 row-span-2"
                />
                <StateCard className="col-span-2 row-span-2" purse={purse} state={botState}/>
                <ChatCard
                    messages={[{sender: "console", message: "Hello World!"}]}
                    className="col-span-4 row-span-10"
                    onMessage={(message) => {
                        console.log(message);
                    }}
                />
                <AuctionsDisplayCard
                    auctions={activeAuctions}
                    className="col-span-6 row-span-3"
                />
                <GraphCard
                    data={[
                        {name: '00:00', Profit: 400},
                        {name: '01:00', Profit: 300},
                        {name: '02:00', Profit: 200},
                        {name: '03:00', Profit: 278},
                        {name: '04:00', Profit: 189},
                    ]}
                    className="col-span-6 row-span-5"
                />
            </main>
        </div>
    )
}
