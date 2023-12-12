import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../../config/axios";
import Button from "../buttons/Button";
import ReplyCommentItem from "./ReplyCommentItem";
import Modal from "../modal/Modal";

const CommentItem = ({username, createdDate, comment, commentId, lastUpdatedAt, parentCommentId}) => {

    const [content, setContent] = useState(comment);

    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isModerator, setIsModerator] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(true);

    const [editMode, setEditMode] = useState(false);
    const [nickName, setNickName] = useState('');

    const [replies, setReplies] = useState([]);
    const [parentId, setParentId] = useState();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(-1);

    const [open, setOpen] = useState(false);

    const [commentContent, setCommentContent] = useState('');
    const [anonymous, setAnonymous] = useState(false);

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

    const getReplies = () => {
        axios
            .get('/comments/' + commentId + '/replies', {
                params: {
                    pageNumber: pageNumber - 1,
                    pageSize: pageSize
                },
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                withCredentials: true
            })
            .then((response) => {
                setReplies([...replies, ...response.data.content]);
                setPageNumber(prevState => prevState + 1);
                setTotalPages(response.data.total_size);
            })
    }

    useEffect(() => {
        if (isNaN(parseInt(parentCommentId))) {
            setParentId(null);
        } else {
            setParentId(parseInt(parentCommentId));
        }
    }, []);

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

    const replyToComment = () => {
        setOpen(false);
        if (commentContent === '') {
            alert("Комментарий не может быть пустым");
            return false;
        } else {
            return axios
                .post('/comments/create-comment-reply',
                    {
                        content: commentContent,
                        is_anonymous: anonymous,
                        parent_comment_id: commentId
                    },
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
                    if (error.response.message === "У вас недостаточно прав для выполнения данного действия") {
                        console.log(error.response);
                    } else return axios
                        .post('/auth/logout', null, {
                            headers: {
                                "Access-Control-Allow-Origin": "*"
                            },
                            withCredentials: true
                        })
                        .then((response) => {
                            sessionStorage.clear();
                            navigate('/');
                            return response.data;
                        })
                        .catch((error) => {
                            return error;
                        })
                })
        }
    }

    const handleButton = () => {
        setOpen(true);
    }

    const handleAnonymous = () => {
        setAnonymous(!anonymous);
    }

    return (
        <div>
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
                                (isAdmin || isModerator) && !isAnonymous &&
                                // isModerator &&
                                <div className="flex mt-3 mb-3 ml-auto mr-2 cursor-pointer" onClick={deleteComment}>
                                    Удалить
                                </div>
                            }
                            {
                                nickName !== '' && nickName === username &&
                                <div className="flex mt-3 mb-3 ml-auto mr-2 cursor-pointer" onClick={turnOnEditMode}>
                                    Изменить
                                </div>
                            }
                            {parentId !== null && JSON.parse(sessionStorage.getItem('user')) !== null &&
                                <div className="flex mt-3 mb-3 ml-auto mr-2 cursor-pointer" onClick={handleButton}>
                                    Ответить
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

            </div>
            <div>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <div className="text-center items-center">
                        <div className="mx-auto my-4 max-w-[75%]">
                            <h3 className="text-lg font-black text-gray-800">Добавить новый комментарий</h3>
                        </div>
                        <div>
                                        <textarea className="mb-3 mt-3 rounded bg-gray-200 w-[100%] justify-center"
                                                  value={commentContent} placeholder="Введите описание"
                                                  onChange={e => setCommentContent(e.target.value)}/>
                            <div className="flex justify-center">
                                <input type="checkbox" id="anonymous" className="mr-2"
                                       onChange={handleAnonymous}/>
                                <label htmlFor="anonymous">Анонимно</label>
                            </div>
                            <Button text="Создать" handleButton={replyToComment}/>
                        </div>
                    </div>
                </Modal>
            </div>
            <div>
                {
                    parentId !== null &&
                    replies.map((reply) => {
                        return (
                            <ReplyCommentItem username={reply.nickname}
                                              commentId={reply.id}
                                              key={reply.id}
                                              createdDate={reply.created_at}
                                              lastUpdatedAt={reply.last_updated_at}
                                              comment={reply.content}
                            />
                        )
                    })
                }
                {(totalPages === -1 || totalPages !== replies.length) && parentId !== null &&
                    <div>
                        <Button text="Загрузить ответы к комментарию" handleButton={getReplies}/>
                    </div>
                }
            </div>
        </div>
    )
}

export default CommentItem;