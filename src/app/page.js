"use client";

import Card from "@/constants/Card";
import {useEffect, useState} from "react";
import Image from "next/image";
import {intToString, toDHMS} from "@/utils/number";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";

function AccountCard({username, uuid, startDate, className}) {
    const elapsed = Math.floor((Date.now() - startDate) / 1000);
    return (
        <Card className={className}>
            <div className="flex flex-rows justify-stretch gap-5">
                <Image
                    src={`https://mc-heads.net/head/${uuid.replace(/-/g, '').trim()}.png`}
                    alt="Minecraft Head"
                    className="border-2 border-white/10 shadow-md p-2 rounded-3xl"
                    width={100}
                    height={100}
                />
                <div className="flex flex-col gap-1 my-3">
                    <h1 className="text-2xl text-primary">{username}</h1>
                    <h2 className="text-lg text-gray-500">{`${toDHMS(elapsed)} elapsed`}</h2>
                </div>
            </div>
        </Card>
    );
}

function QuickProfitCard({profit, profitThisHour, startDate, profitThisHourQueue, className}) {
    const elapsed = Math.floor((Date.now() - startDate) / 1000);
    return (
        <Card className={className}>
            <div className="flex flex-col gap-1 my-3">
                <h1 className="text-2xl text-primary">{`Total Profit: ${intToString(profit)} coins (${intToString(profit * 3600 / Math.max(elapsed, 1))} coins/h)`}</h1>
                <h2 className="text-lg text-gray-500">{`Profit This Hour: ${intToString(profitThisHour)} coins`}</h2>
                <h2 className="text-lg text-gray-500">{`Profit from Previous Flip: ${intToString(profitThisHourQueue[profitThisHourQueue.length - 1]?.profit || 0)} coins`}</h2>
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
                            <h1 className="text-primary">{message.username}</h1>
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
            <div className="flex flex-col gap-1 my-3">
                {auctions.map((auction, index) => (
                    <div key={index} className="flex flex-row gap-2">
                        <h1 className="text-primary">{auction.username}</h1>
                        <h2 className="text-gray-500">{auction.message}</h2>
                    </div>
                ))}
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
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="profit" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
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

    return (
        <main className="grid grid-cols-10 grid-rows-6 gap-4 m-8">
            <AccountCard
                username={username || "aesthetic0001"}
                uuid={uuid || "04d4147f0bce4f03a8c2b71884680136"}
                startDate={startDate}
                className="col-span-3 row-span-1"/>
            <QuickProfitCard
                profit={profit}
                profitThisHour={profitThisHour}
                startDate={startDate}
                profitThisHourQueue={profitThisHourQueue}
                className="col-span-3 row-span-1"/>
            <ChatCard
                messages={[{username: "aesthetic0001", message: "Hello World!"}]}
                className="col-span-4 row-span-4"
                onMessage={(message) => {
                    console.log(message);
                }}
            />
            <AuctionsDisplayCard
                auctions={[{username: "aesthetic0001", message: "Auction 1"}]}
                className="col-span-6 row-span-1"
            />
            <GraphCard
                data={[
                    { name: '00:00', profit: 400 },
                    { name: '01:00', profit: 300 },
                    { name: '02:00', profit: 200 },
                    { name: '03:00', profit: 278 },
                    { name: '04:00', profit: 189 },
                    // Add more data points as needed
                ]}
                className="col-span-6 row-span-2"
            />
        </main>
    )
}
