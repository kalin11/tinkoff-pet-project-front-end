import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../../config/axios";
import Button from "../buttons/Button";

const ReplyCommentItem = ({username, createdDate, comment, commentId, lastUpdatedAt, parentCommentId}) => {

    const [content, setContent] = useState(comment);

    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isModerator, setIsModerator] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(true);

    const [editMode, setEditMode] = useState(false);
    const [nickName, setNickName] = useState('');

    const [replies, setReplies] = useState([]);
    const [parentId, setParentId] = useState(43);

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

    // useEffect(() => {
    //     if (isNaN(parseInt(parentCommentId))) {
    //         setParentId(null);
    //     }
    //     else {
    //         setParentId(parentId(parentCommentId));
    //     }
    // }, []);

    useEffect(() => {
        if (JSON.parse(sessionStorage.getItem('user')) === null) {
            setIsAdmin(false);
            setIsModerator(false);
            setIsAnonymous(true);
        } else {
            if (JSON.parse(sessionStorage.getItem('user')).role === 'Администратор') {
                setIsAdmin(true);
                setIsAnonymous(false);
            } else if (JSON.parse(sessionStorage.getItem('user')).role === 'Модератор') {
                setIsModerator(true);
                setIsAnonymous(false);
            }
            setNickName(JSON.parse(sessionStorage.getItem('user')).nickname);
        }

    }, []);
    return (
        <div className="bg-white rounded ml-auto mt-3 mb-3 w-[90%]" key={commentId}>
            <div>
                <div className="flex cursor-pointer" onClick={goToProfile}>
                    {username}, в ответ на комментарий выше
                </div>
                <div className="flex">
                    <div className="flex mt-3 mb-3">
                        Дата создания - {createdDate}
                    </div>
                    <div className="flex ml-auto">
                        {
                            (isAdmin || isModerator) && !isAnonymous &&
                            // isModerator &&
                            <div className="flex mt-3 mb-3 ml-auto mr-2 cursor-pointer" onClick={deleteComment}>
                                Удалить
                            </div>
                        }
                        {
                            nickName === username &&
                            <div className="flex mt-3 mb-3 ml-auto mr-2 cursor-pointer" onClick={turnOnEditMode}>
                                Изменить
                            </div>
                        }
                    </div>
                </div>

            </div>
            <div className="flex mt-3 mb-3">
                Дата изменения - {lastUpdatedAt}
            </div>
            {!editMode &&
                <div className="flex">
                    {comment}
                    <div className="flex ml-1">
                        {createdDate !== lastUpdatedAt &&
                            '(ред.)'
                        }
                    </div>
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
            {
                parentId !== null &&
                <div>

                </div>
            }

        </div>
    )
}

export default ReplyCommentItem;