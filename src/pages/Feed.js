import Header from "../components/headers/Header";
import Button from "../components/buttons/Button";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../config/axios";
import FeedItem from "../components/items/FeedItem";
import Modal from "../components/modal/Modal";

const Feed = () => {

    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const [fetching, setFetching] = useState(true);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isModerator, setIsModerator] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(true);

    const [open, setOpen] = useState(false);

    const [publicationTitle, setPublicationTitle] = useState('');
    const [publicationDesc, setPublicationDesc] = useState('');
    const [files, setFiles] = useState([]);


    const goToCourses = () => {
        navigate('/courses');
    }

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100
            && totalPages === posts.length) {
            setFetching(true);
        }
    }

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
        }

    }, []);

    useEffect(() => {
        if (fetching) {
            axios
                .get('/news_publications',
                    {
                        params: {
                            pageNumber: pageNumber - 1,
                            pageSize: pageSize,
                        },
                        headers: {
                            "Access-Control-Allow-Origin": "*"
                        },
                        withCredentials: true
                    }
                )
                .then(response => {
                    setPosts([...posts, ...response.data.content]);
                    setPageNumber(prevState => prevState + 1);
                    setTotalPages(response.data.total_pages);
                })
                .finally(() => setFetching(false));
        }
    }, [fetching]);

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);

        return function () {
            document.removeEventListener('scroll', scrollHandler);
        }
    }, []);

    const handleButton = () => {
        setOpen(true);
    }

    const handleFiles = (event) => {
        let selectedFiles = event.target.files;
        const validFiles = [];
        const validExtension = ['jpg', 'png', 'pdf'];
        const maxSize = 5 * 1024 * 1024;
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (!validExtension.includes(fileExtension)) {
                alert(`"Файл ${file.name} имеет неверное расширение. Допустимые расширения: ${validExtension.join(', ')}"`);
                continue;
            }

            if (file.size > maxSize) {
                alert(`"Файл ${file.name} превышает допустимый размер (5 MB)."`);
                continue;
            }
            validFiles.push(file);
        }

        setFiles(validFiles);
        console.log(validFiles);

    }

    const handleNewNews = () => {
        const formData = new FormData();
        if (publicationTitle === '') {
            alert("Почему название поста пустое?");
            return false;
        } else if (publicationDesc === '') {
            alert("Добавьте описание поста");
            return false;
        } else {
            formData.append('title', publicationTitle);
            formData.append('description', publicationDesc);

            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            return axios
                .post('/news_publications', formData, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                })
                .then((response) => {
                    setOpen(false);
                    return response.data;
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        if (error.response.message === "У вас недостаточно прав для выполнения данного действия") {
                            console.log("Недостаточно прав");
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

                    }
                    console.log(error.response.data);
                    return error.response.data;
                });
        }

    }



    return (
        <div>
            <Header/>
            <div className="flex-col">
                {
                    (isAdmin || isModerator) && !isAnonymous &&
                    <div>
                        <Button text="Создать новость" handleButton={handleButton}/>
                    </div>
                }
                <div className="ml-[85%]">
                <Button text="Найти нужный материал" handleButton={goToCourses}/>
                </div>
            </div>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center items-center">
                    <div className="mx-auto my-4 max-w-[75%]">
                        <h3 className="text-lg font-black text-gray-800">Добавить новый пост</h3>
                    </div>
                    <div>
                        <label>
                            <input
                                className="mx-auto w-[200px] text-center flex justify-center mb-3 mt-3 bg-gray-200 rounded"
                                type="text" placeholder="Название продукта"
                                id="subjectName" value={publicationTitle}
                                onChange={e => setPublicationTitle(e.target.value)}/>
                        </label>
                        <textarea className="mb-3 mt-3 rounded bg-gray-200 w-[100%] justify-center"
                                  value={publicationDesc} placeholder="Введите описание"
                                  onChange={e => setPublicationDesc(e.target.value)}/>
                        <input type="file" multiple className="flex justify-center mb-3 mt-3"
                               onChange={e => handleFiles(e)}/>
                        <Button text="Создать" handleButton={handleNewNews}/>
                    </div>
                </div>
            </Modal>
            <div>
                {
                    posts.map((post) => {
                        return (
                            <FeedItem description={post.description}
                                      createdAt={post.created_at}
                                      newsId={post.id}
                                      newsTitle={post.title}
                                      files={post.files}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Feed;