import { useEffect, useState } from "react";
import { getRooms } from "../service";


function Rooms(props) {

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const data = await getRooms();
        setRooms(data.data);
    }

    return (
        <div className="room-com">
            <h2 className="heading">Rooms</h2>
            <div className="room-data">
                <ul>
                    {rooms && rooms.length > 0 && rooms.map((room, index) => {
                        return (
                            <div className="room" onClick={() => props.handleRoom(room.name)}>
                                <span>name:<label className="font-bold" id={index + 1}>{room.name}</label></span>
                                <p>msgs:<span id={index + 2}>{room.messages.length}</span></p>
                            </div>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Rooms;