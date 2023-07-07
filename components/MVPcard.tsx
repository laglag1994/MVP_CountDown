import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from 'react-query';
import KillerNameModal from "./KillerNameModal";


export type MvpCard = {
    id: number
    name: string;
    img?: string;
    respawnTime: number;
    lastKillTime: Date;
    isAlive: boolean;
};

interface MvpProps {
    cards: MvpCard[];
}

const updateMvpInfo = async ({
    mvpId,
    lastKillTime,
    alive,
}: {
    mvpId: number,
    lastKillTime: Date,
    alive: boolean,
}) => {
    const updatedData = await fetch("/api/mvp", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: mvpId,
            isAlive: alive,
            lastKillTime: lastKillTime
        }),
    });
    return updatedData.json();

};


const MVPcard: React.FC<MvpProps> = ({ cards }) => {
    const queryClient = useQueryClient();

    const { isLoading, error, data, mutateAsync } = useMutation(
        "updateMvp",
        updateMvpInfo
    );

    const [showModal, setShowModal] = useState(false)

    const handleMvpUpdate = async (id: number) => {
        const currentMvp = cards.find((card) => card.id === id)
        console.log(currentMvp)

        if (!currentMvp) return

        const currentTime = new Date();
        const lastKillTime = currentTime; // Set lastKillTime to the current time

        const difference = currentMvp.respawnTime + lastKillTime.getTime();
        const TimeDifference = new Date(difference).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });


        if (currentMvp.isAlive) {
            const alive = !currentMvp.isAlive;
            const res = await mutateAsync({
                mvpId: id,
                alive: alive,
                lastKillTime: lastKillTime,
            });
            queryClient.invalidateQueries(["mvplist"]);
            console.log(res, "results")

        } else {
            alert(currentMvp.name + " is dead")
        }

        console.log(TimeDifference, "respawn")
        console.log(lastKillTime, "lastkilltime")
        console.log(currentTime, "now")


    };


    cards.forEach((card) => {
        const currentTime = new Date();
        const lastKillTime = new Date(card.lastKillTime);
        const deadToAlive = card.respawnTime * 1000 + lastKillTime.getTime() <= currentTime.getTime();

        if (deadToAlive && !card.isAlive) {

            mutateAsync({
                mvpId: card.id,
                alive: true,
                lastKillTime: card.lastKillTime,
            });
            queryClient.invalidateQueries(["mvplist"]);
        }
    });


    // console.log(data, "data")

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error has occurred</div>;

    return (
        <div className="flex justify-center items-center gap-10 flex-wrap">
            {cards.map((card, index) => {
                const lastKillTime = new Date(card.lastKillTime);
                const difference = card.respawnTime + lastKillTime.getTime();
                const TimeDifference = new Date(difference).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                const lastKillFormat = lastKillTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                return (
                    <div key={index} className="flex flex-col justify-center items-center border-2 bg-[#DCD7C9] border-[#A27B5C] w-[200px]">
                        <span>{card.name}</span>
                        <span>
                            <img className="custom-height" src={card.img} alt="" height="100px" />
                        </span>

                        <span className={`${card.isAlive ? 'text-green-700' : 'text-red-700'} capitalize`}>
                            {card.isAlive ? 'alive' : `last killing: ${lastKillFormat}`}
                        </span>

                        <span className={`capitalize`}>
                            {card.isAlive ? '' : `respawns: ${TimeDifference}`}
                        </span>

                        <button onClick={() => {
                            handleMvpUpdate(card.id)
                            setShowModal(true)
                        }} className="bg-red-700 w-full text-white py-1 capitalize">kill</button>
                        <button className="bg-[#A27B5C] w-full text-white py-1 capitalize">edit</button>
                    </div>
                );
            })}

            <KillerNameModal show={showModal} setShow={setShowModal}></KillerNameModal>
        </div>
    );

};

export default MVPcard;



