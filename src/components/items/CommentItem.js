import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../../config/axios";
import Button from "../buttons/Button";

const CommentItem = ({username, createdDate, comment, commentId}) => {

    const [content, setContent] = useState(comment);

    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isModerator, setIsModerator] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const goToProfile = () => {
        if (username !== '') {
            navigate('/users/' + username);
        }
    }

    const turnOnEditMode = () => {
        setEditMode(!editMode);
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

    const updateComment = () => {
        setEditMode(false);
        return axios
            .put('/comments', {id: commentId, content: content},
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    console.log("Недостаточно прав")
                }
                return error.response;
            })
    }

    useEffect(() => {
        if (JSON.parse(sessionStorage.getItem('user')) === null) {
            setIsAdmin(false);
        } else if (JSON.parse(sessionStorage.getItem('user')).role === 'Администратор') {
            setIsAdmin(true);
        } else if (JSON.parse(sessionStorage.getItem('user')).role === 'Модератор') {
            setIsModerator(true);
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
                        Дата создания - {createdDate}
                    </div>
                    <div className="flex ml-auto">
                        {
                            (isAdmin || isModerator) &&
                            <div className="flex mt-3 mb-3 ml-auto mr-2 cursor-pointer" onClick={deleteComment}>
                                Удалить
                            </div>
                        }
                        {
                            username === JSON.parse(sessionStorage.getItem('user')).nickname &&
                            <div className="flex mt-3 mb-3 ml-auto mr-2 cursor-pointer" onClick={turnOnEditMode}>
                                Изменить
                            </div>
                        }
                    </div>
                </div>

            </div>
            <div className="flex mt-3 mb-3">
                Дата изменения - тут будет дата изменения
            </div>
            {!editMode &&
                <div className="flex">
                    {comment}
                </div>
            }
            {
                editMode &&
                <div>
                    <textarea className="flex rounded bg-gray-200" defaultValue={comment}
                              onChange={e => setContent(e.target.value)}/>
                    <Button text="Обновить комментарий" handleButton={updateComment}/>
                </div>
            }

        </div>
    )
}

export default CommentItem;