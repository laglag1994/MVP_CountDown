import Modal from "./Modal";
import { useState } from "react";

interface AddNewKiller {
  show: boolean;
  setShow: (show: boolean) => void;
  setKillerName: (name: string) => void; // Add this line
  setIsModalSubmitted: (isSubmitted: boolean) => void;
  handleMvpUpdate: (id: number) => void;


}

const KillerNameModal: React.FC<AddNewKiller> = ({ show, setShow, setKillerName, setIsModalSubmitted, handleMvpUpdate}) => {
  const [newName, setNewName] = useState("");

  console.log("new killer:", newName);


  return (
    <Modal show={show} setShow={setShow} title="Write your name">
      <div className="flex flex-col gap-5">

        <input
          type="text"
          className="bg-gray-200"
          placeholder="name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />


        <button
          className="bg-[#A27B5C]"
          onClick={() => {
            setKillerName(newName)
            setShow(false);
            setIsModalSubmitted(true)
            //TODO 
            //pass the id but idk how :( 
            handleMvpUpdate(id????????????????????????)
          }}
        >Save</button>
      </div>
    </Modal>
  );
};

export default KillerNameModal;
