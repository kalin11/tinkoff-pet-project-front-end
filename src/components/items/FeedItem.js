import axios from "../../config/axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import CommentItem from "./CommentItem";
import Button from "../buttons/Button";
import Modal from "../modal/Modal";

const FeedItem = ({newsId, createdAt, description, nickname, newsTitle, files}) => {

    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [comments, setComments] = useState([]);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(-1);
    const [open, setOpen] = useState(false);

    const [commentContent, setCommentContent] = useState('');

    const [anonymous, setAnonymous] = useState(false);

    useEffect(() => {
        if (JSON.parse(sessionStorage.getItem('user')) === null) {
            setIsAdmin(false);
        } else if (JSON.parse(sessionStorage.getItem('user')).role === 'Администратор') {
            setIsAdmin(true);
        }
    }, []);

    const deleteNews = () => {
        return axios
            .delete('/publications/' + newsId, {
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

    const downloadFile = (file) => {
        return axios
            .get('/files/' + file.file_name_in_directory,
                {
                    responseType: 'blob',
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                }
            )
            .then((response) => {
                const url = URL.createObjectURL(response.data);
                const a = document.createElement("a");
                a.href = url;
                a.download = file.initial_file_name;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
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

    const handleButton = () => {
        setOpen(true);
    }


    const handleAnonymous = () => {
        setAnonymous(!anonymous);
    }


    const handleNewComment = () => {
        setOpen(false);
        if (commentContent === '') {
            alert("Комментарий не может быть пустым");
            return false;
        } else {
            return axios
                .post('/comments',
                    {
                        content: commentContent,
                        publication_id: parseInt(newsId),
                        is_anonymous: anonymous
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


    const getCommentsForNews = () => {
        axios
            .get('/comments', {
                params: {
                    publicationId: newsId,
                    pageNumber: pageNumber - 1,
                    pageSize: pageSize
                },
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                withCredentials: true
            })
            .then((response) => {
                setComments([...comments, ...response.data.content]);
                setPageNumber(prevState => prevState + 1);
                setTotalPages(response.data.total_size);
            })
    }

    return (
        <div>
            <div className="mt-[100px] min-w-[900px] max-w-[80vw] mx-auto justify-center">
                <div className="mx-auto mb-3 justify-items-center w-[80%] overflow-auto">
                    <div
                        className="text-center block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h3 className="mb-2 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">{newsTitle}</h3>
                        <h6 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">Описание: {description}</h6>
                        <h6 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">Дата
                            создания: {createdAt}</h6>
                        <div>
                            <ul>
                                {
                                    files.map((file) => {
                                        return (
                                            <li key={file.id}
                                                className="cursor-pointer hover:bg-sky-300 text-2 tracking-tight text-gray-900 dark:text-white"
                                                onClick={() => downloadFile(file)}>{file.initial_file_name}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div>
                            {
                                comments.map((comment) => {
                                    return (
                                        <CommentItem commentId={comment.id}
                                                     key={comment.id}
                                                     createdDate={comment.created_at}
                                                     lastUpdatedAt={comment.last_updated_at}
                                                     comment={comment.content}
                                                     username={comment.nickname}
                                                     parentCommentId={comment.id}
                                        />
                                    )
                                })
                            }
                        </div>
                        {(totalPages === -1 || totalPages !== comments.length) &&
                            <div>
                                <Button text="Загрузить комментарии" handleButton={getCommentsForNews}/>
                            </div>
                        }
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
                                            <label for="anonymous">Анонимно</label>
                                        </div>
                                        <Button text="Создать" handleButton={handleNewComment}/>
                                    </div>
                                </div>
                            </Modal>

                            {
                                (sessionStorage.getItem('user') !== null) &&
                                <Button text="Создать новый комментарий" handleButton={handleButton}/>
                            }
                        </div>
                    </div>
                    {isAdmin &&
                        <div>
                            <Button text="Удалить новость" handleButton={deleteNews}/>
                        </div>
                    }
                </div>
            </div>
        </div>

    )

}

export default FeedItem;