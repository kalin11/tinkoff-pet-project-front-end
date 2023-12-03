import axios from "../../config/axios";
import {useEffect, useState} from "react";

const PublicationItem = ({authorName, publicationId, publicationTitle, handleClick}) => {

    const handle = () => {
        handleClick(publicationId);
    }

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (JSON.parse(sessionStorage.getItem('user')) === null) {
            setIsAdmin(false);
        }
        else if (JSON.parse(sessionStorage.getItem('user')).role === 'Администратор') {
            setIsAdmin(true);
        }
    }, []);

    const deletePublication = () => {
        return axios
            .delete('/publications/' + publicationId, {
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                withCredentials: true
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                return error.response.data;
            })
    }

    return (
        <div className="flex mr-0">
            <div className="cursor-pointer mx-auto mb-3 justify-items-center w-[80%]" key={publicationId}
                 onClick={handle}>
                <div
                    className="text-center block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{publicationTitle}</h5>
                    <h5 className="text-xs dark:text-white">Автор поста - {authorName}</h5>
                </div>
            </div>
            {
                isAdmin &&
                <div className="text-white ml-auto mb-auto w-[10%] cursor-pointer">
                    <div className="bg-gray-50 text-black rounded" onClick={deletePublication}>
                        Удалить
                    </div>
                </div>
            }
        </div>

    )

}

export default PublicationItem;