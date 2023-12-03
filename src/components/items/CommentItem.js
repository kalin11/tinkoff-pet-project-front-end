import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../../config/axios";

const CommentItem = ({username, createdDate, comment, commentId}) => {

    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const goToProfile = () => {
        if (username !== '') {
            navigate('/users/' + username);
        }
    }

    const deleteComment = () => {
        return axios
            .delete('/comments/' + commentId, {
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

    useEffect(() => {
        if (JSON.parse(sessionStorage.getItem('user')) === null) {
            setIsAdmin(false);
        } else if (JSON.parse(sessionStorage.getItem('user')).role === 'Администратор') {
            setIsAdmin(true);
        }
    }, []);
    return (
        <div className="bg-white rounded mt-3 mb-3" key={commentId}>
            <div>
                <div className="flex cursor-pointer" onClick={goToProfile}>
                    {username}
                </div>
                <div className="flex">
                    <div className="flex mt-3 mb-3">
                        {createdDate}
                    </div>
                    {
                        isAdmin &&
                        <div className="flex mt-3 mb-3 ml-auto mr-2 cursor-pointer" onClick={deleteComment}>
                            Удалить
                        </div>
                    }
                </div>

            </div>
            <div className="flex">
                {comment}
            </div>

        </div>
    )
}

export default CommentItem;