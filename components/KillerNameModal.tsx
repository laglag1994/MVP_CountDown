import Modal from "./Modal";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from 'react-query';
import { MvpCard } from "./MVPcard";




interface AddNewKiller {
  show: boolean;
  setShow: (show: boolean) => void;
  mvp?: MvpCard

}

export const updateMvpInfo = async ({
  mvpId,
  lastKillTime,
  alive,
  killerName
}: {
  mvpId: number,
  lastKillTime: Date,
  alive: boolean,
  killerName: string
}) => {
  const updatedData = await fetch("/api/mvp", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: mvpId,
      isAlive: alive,
      lastKillTime: lastKillTime,
      killerName: killerName
    }),
  });
  return updatedData.json();

};



const KillerNameModal: React.FC<AddNewKiller> = ({ show, setShow, mvp }) => {
  const [newName, setNewName] = useState("");

  const queryClient = useQueryClient();

  const { isLoading, error, data, mutateAsync } = useMutation(
    "updateMvp",
    updateMvpInfo
  );




  const handleMvpUpdate = async () => {



    if (!mvp) return

    const currentTime = new Date();
    const lastKillTime = currentTime;

    const difference = mvp.respawnTime + lastKillTime.getTime();
    const TimeDifference = new Date(difference).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });



    const alive = false;
    const res = await mutateAsync({
      mvpId: mvp.id,
      alive: alive,
      lastKillTime: lastKillTime,
      killerName: newName,
    });
    queryClient.invalidateQueries(["mvplist"]);



    console.log(res, "results")
    console.log(TimeDifference, "respawn")
    console.log(lastKillTime, "lastkilltime")
    console.log(currentTime, "now")
    setShow(false)

  };






  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred</div>;


  return (
    <Modal show={show} setShow={setShow} title="Write your name">
      <div className="flex flex-col gap-5">
        <span className="text-gray-500 text-sm"> not required</span>

        <input
          type="text"
          className="bg-gray-200 py-2"
          placeholder="name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />


        <button
          className="bg-[#A27B5C] text-white py-2"
          onClick={() => {
            handleMvpUpdate()
          }}
        >Save</button>
      </div>
    </Modal>
  );
};

export default KillerNameModal;
