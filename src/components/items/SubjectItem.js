import {useEffect, useState} from "react";
import axios from "../../config/axios";

const SubjectItem = ({subjectId, subjectName, handleClick}) => {

    const [isAdmin, setIsAdmin] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const handle = () => {
        handleClick(subjectId);
    }

    const deleteSubject = () => {
        return axios
            .delete('/subjects/' + subjectId,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                }
            )
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                return error.response;
            })
    }

    useEffect(() => {
        if (JSON.parse(sessionStorage.getItem('user')) === null) {
            setIsAdmin(false);
            setIsAnonymous(true);
        } else {
            if (JSON.parse(sessionStorage.getItem('user')).role === 'Администратор') {
                setIsAdmin(true);
                setIsAnonymous(false);
            }
        }
    }, []);

    return (
        <div className="cursor-pointer mx-auto mb-3 justify-items-center w-[80%]" key={subjectId}>
            <div onClick={handle}
                 className="text-center block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{subjectName}</h5>
            </div>
            {
                isAdmin &&
                <div className="flex mr-auto" onClick={deleteSubject}>
                    Удалить
                </div>
            }
        </div>
    )
}

export default SubjectItem;