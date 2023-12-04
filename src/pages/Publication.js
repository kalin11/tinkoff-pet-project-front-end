import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../config/axios";
import Header from "../components/headers/Header";
import CommentItem from "../components/items/CommentItem";
import {Pagination} from "@mui/material";
import Modal from "../components/modal/Modal";
import Button from "../components/buttons/Button";

const Publication = () => {
    const {id} = useParams();

    const [files, setFiles] = useState([]);
    const [publicationTitle, setPublicationTitle] = useState('');
    const [publicationDesc, setPublicationDesc] = useState('');
    const [publicationCreatedAt, setPublicationCreatedAt] = useState();

    const [comments, setComments] = useState([]);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [open, setOpen] = useState(false);
    const [commentContent, setCommentContent] = useState('');

    const [anonymous, setAnonymous] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const getPublication = () => {
            return axios
                .get('/publications/' + parseInt(id), {
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
                                ;
                                navigate('/');
                                return response.data;
                            })
                            .catch((error) => {
                                return error;
                            })
                    }
                    return error;
                })
        }

        const getComments = () => {
            return axios
                .get('/comments', {
                    params: {
                        pageNumber: pageNumber - 1,
                        pageSize: pageSize,
                        publicationId: id
                    },
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                })
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
                            ;
                            navigate('/');
                            return response.data;
                        })
                        .catch((error) => {
                            return error;
                        })
                })
        }

        const getDataComments = async () => {
            let comments = await getComments();
            console.log(comments);
            setTotalPages(comments.totalPages);

            let list = [];
            for (let i = 0; i < comments.content.length; i++) {
                let id = comments.content[i].id;
                let content = comments.content[i].content;
                let created_at = comments.content[i].created_at;
                let username = comments.content[i].nickname;

                list.push(
                    {
                        id: id,
                        username: username,
                        content: content,
                        created_at: created_at
                    }
                )
            }

            setComments(list);

        }

        const getData = async () => {
            let publication = await getPublication();

            console.log("Заголовок " + publication.title)
            console.log("Описание " + publication.description)
            console.log("Дата создания " + publication.created_at)
            console.log("Файлы " + publication.files)

            setPublicationTitle(publication.title);
            setPublicationDesc(publication.description);
            setPublicationCreatedAt(publication.created_at);
            setFiles(publication.files);
        }

        getData().catch(console.error);
        getDataComments().catch(console.error);

    }, [pageNumber, pageSize, open]);

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
                        publication_id: parseInt(id),
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
                            ;
                            navigate('/');
                            return response.data;
                        })
                        .catch((error) => {
                            return error;
                        })
                })
        }
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
                        ;
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


    return (
        <div>
            <Header/>
            <div className="mt-[100px] min-w-[900px] max-w-[80vw] mx-auto justify-center">
                <div className="mx-auto mb-3 justify-items-center w-[80%] overflow-auto">
                    <div
                        className="text-center block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h3 className="mb-2 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">{publicationTitle}</h3>
                        <h6 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">Описание: {publicationDesc}</h6>
                        <h6 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">Дата
                            создания: {publicationCreatedAt}</h6>
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
                    </div>
                </div>
            </div>

            <div className="mt-[100px] min-w-[900px] max-w-[80vw] mx-auto justify-center overflow-auto">
                <div className="mx-auto mb-3 justify-items-center w-[80%] overflow-auto">
                    <div
                        className="text-center block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 overflow-auto">
                        <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Комментарии</h4>
                        <div>
                            {
                                comments.map((comment) => {
                                    return (
                                        <CommentItem key={comment.id}
                                                     comment={comment.content}
                                                     createdDate={comment.created_at}
                                                     username={comment.username}
                                                     commentId={comment.id}/>
                                    )
                                })
                            }
                        </div>
                        <div>
                            {!!totalPages &&
                                <Pagination
                                    color="primary"
                                    count={totalPages}
                                    page={pageNumber}
                                    onChange={(_, num) => {
                                        setPageNumber(num);
                                    }}
                                />
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
                </div>
            </div>
        </div>
    )
}

export default Publication;