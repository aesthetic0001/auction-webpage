"use client";

import Card from "@/constants/Card";
import {useState} from "react";
import Image from "next/image";

function AccountCard({username, uuid}) {
    return (
        <Card>
            <div className="flex flex-rows justify-center gap-5">
                <Image
                    src={`https://mc-heads.net/head/${uuid.replace(/-/g, '').trim()}.png`}
                    alt="Minecraft Head"
                    className="border-2 border-white/10 shadow-md p-2 rounded-3xl"
                    width={100}
                    height={100}
                />
                <div className="flex flex-col my-3">
                    <h1 className="text-2xl text-primary">{username}</h1>
                </div>
            </div>
        </Card>
    );
}

export default function Home() {
    const [username, setUsername] = useState(null);
    const [uuid, setUuid] = useState(null);

    return (
        <main className="grid grid-cols-4 gap-4 m-8">
            <AccountCard username={username || "aesthetic0001"} uuid={uuid || "04d4147f0bce4f03a8c2b71884680136"} className="col-span-2"/>
        </main>
    )
}
