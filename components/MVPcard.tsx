import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from 'react-query';
import KillerNameModal, { updateMvpInfo } from "./KillerNameModal";
import defaultImage from "../public/PRM.png"




export type MvpCard = {
    id: number
    name: string;
    img?: string;
    respawnTime: number;
    lastKillTime: Date;
    isAlive: boolean;
    killerName: string
};

interface MvpProps {
    cards: MvpCard[];
}


const MVPcard: React.FC<MvpProps> = ({ cards }) => {



    const [selectedMvp, setSelectedMvp] = useState<MvpCard>()
    const [showModal, setShowModal] = useState(false)

    const { isLoading, error, data, mutateAsync } = useMutation(
        "updateMvp",
        updateMvpInfo
    );
    const queryClient = useQueryClient();


    cards.forEach((card) => {
        const currentTime = new Date();
        const lastKillTime = new Date(card.lastKillTime);
        const deadToAlive = card.respawnTime + lastKillTime.getTime() <= currentTime.getTime();

        if (deadToAlive && !card.isAlive) {

            mutateAsync({
                mvpId: card.id,
                alive: true,
                lastKillTime: card.lastKillTime,
                killerName: card.killerName
            });
            queryClient.invalidateQueries(["mvplist"]);
        }
    });



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

                        <span className="pt-4">{card.name}</span>

                        <div className="flex flex-col justify-center items-center h-56">
                            <span>
                                <img
                                    className="custom-height"
                                    src={card.img ?? "/PRM.png"}
                                    alt=""
                                    height="100px"
                                />
                            </span>

                            <span className={`${card.isAlive ? 'text-green-700' : 'text-red-700'} capitalize pt-3`}>
                                {card.isAlive ? 'alive' : `last killing: ${lastKillFormat}`}
                            </span>

                            <span className={`capitalize`}>
                                {card.isAlive ? '' : `respawns: ${TimeDifference}`}
                            </span>
                            <span className={`capitalize`}>
                                {card.isAlive ? '' : `killer: ${card.killerName}`}
                            </span>
                        </div>



                        <button onClick={() => {
                            setShowModal(true)
                            setSelectedMvp(card)
                        }} className="bg-red-700 w-full text-white py-1 capitalize hover:opacity-70 transition-all duration-500">kill</button>

                    </div>
                );
            })}

            <KillerNameModal
                show={showModal}
                setShow={setShowModal}
                mvp={selectedMvp}
            />

        </div>
    );

};

export default MVPcard;



