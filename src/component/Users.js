import { useEffect, useState } from "react";
import { getUsers } from "../service";


function Users(props) {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const data = await getUsers();
        setUsers(data.data);
    }

    return (
        <div>
            <h2 className="heading">Users</h2>
            <div >
                <ul style={{paddingTop:'25px',listStyleType:'none'}}>
                    {users && users.length > 0 && users.map((user, index) => {
                        return <li onClick={()=>props.handleUserName(user.username)} style={{cursor:'pointer'}} id={index}>{user.username}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Users;