import Modal from "./Modal";
import { useState } from "react";

interface AddNewKiller {
  show: boolean;
  setShow: (show: boolean) => void;
}

const KillerNameModal: React.FC<AddNewKiller> = ({ show, setShow }) => {
  const [newName, setNewName] = useState("");

  const handleSave = () => {
    console.log("New Name:", newName);
    setShow(false); 
  };

  return (
    <Modal show={show} setShow={setShow} title="Write your name">
      <div className="flex gap-5">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleSave}>Save</button>
      </div>
    </Modal>
  );
};

export default KillerNameModal;
