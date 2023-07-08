import { useEffect, useState } from "react";
import Modal from './Modal'
import { MvpCard } from "./MVPcard";


interface AddNewMvp {
    show: boolean;
    setShow: (show: boolean) => void;
    mvp?: MvpCard
}

const AddMvpModal: React.FC<AddNewMvp> = ({ show, setShow, mvp }) => {

    const [newMvpName, setNewMvpName] = useState("");


    const handleAddMvp = async () => {


        const response = await fetch("/api/mvp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newMvpName,
            }),
        });

        if (response.status === 400) {
            alert("MVP already exists");
        } else if (response.status === 201) {
            alert("MVP created");
        } else {
            console.log("err")
        }
        setShow(false);
    };


    return (
        <Modal show={show} setShow={setShow} title="Add New MVP">
            <div className="flex flex-col gap-5">
                <span className="text-gray-500 text-sm">note: img will be added later</span>
                <span className="text-gray-500 text-sm">note: default respawn time will be 150 mins</span>
                <input
                    type="text"
                    className="bg-gray-200 py-2"
                    placeholder="name"
                    value={newMvpName}
                    onChange={(e) => setNewMvpName(e.target.value)}
                />

                <button
                    className="bg-[#A27B5C] text-white py-2"
                    onClick={handleAddMvp}
                >
                    ADD
                </button>
            </div>
        </Modal>
    );
};

export default AddMvpModal;
