import {useEffect, useState} from "react";
import axios from "../config/axios";
import Header from "../components/headers/Header";
import PublicationItemList from "../components/items/PublicationItemList";
import {Pagination} from "@mui/material";
import Button from "../components/buttons/Button";
import Modal from "../components/modal/Modal";
import {useNavigate} from "react-router-dom";


const Publications = ({subjectTopicId, publications, setPublications, selectedPublication, setSelectedPublication}) => {

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [open, setOpen] = useState(false);

    const [publicationTitle, setPublicationTitle] = useState('');
    const [publicationDesc, setPublicationDesc] = useState('');

    const [files, setFiles] = useState([]);

    const navigate = useNavigate();


    const handleButton = () => {
        setOpen(true);
    }

    const goToPublicationPage = async () => {
        let data = await handleNewPublication();
        setSelectedPublication(data.id);
        if (data !== false) {
            navigate("/publications/" + data.id);
        }
    }

    const handleNewPublication = () => {
        const formData = new FormData();
        if (publicationTitle === '') {
            alert("Почему название поста пустое?");
            return false;
        } else if (publicationDesc === '') {
            alert("Добавьте описание поста");
            return false;
        } else if (subjectTopicId === undefined || isNaN(subjectTopicId)) {
            alert("Чет фигня какая-то");
            return false;
        } else {
            formData.append('title', publicationTitle);
            formData.append('description', publicationDesc);
            formData.append('subjectTopicId', subjectTopicId);

            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            return axios
                .post('/publications', formData, {
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

    const getExtension = (filename) => {
        console.log(filename);
        return filename.split('/').pop();
    }

    useEffect(() => {
        const getPublications = () => {
            return axios
                .get('/publications', {
                    params: {
                        subjectTopicId: subjectTopicId,
                        pageNumber: pageNumber - 1,
                        pageSize: pageSize
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

        const getData = async () => {
            let publications = await getPublications();

            setTotalPages(publications.total_pages);

            let list = [];
            for (let i = 0; i < publications.content.length; i++) {
                console.log(publications.content[i]);
                let authorName = publications.content[i].nickname;
                let id = publications.content[i].id;
                let description = publications.content[i].title;
                list.push(
                    {
                        authorName: authorName,
                        id: id,
                        title: description
                    }
                );
            }

            setPublications(list);
            console.log(list);
        }

        getData().catch(console.error);

    }, [pageNumber, pageSize]);

    return (
        <div>
            <Header/>
            <div className="mt-[200px]">
                <PublicationItemList publications={publications}
                                     selectedPublication={selectedPublication}
                                     setSelectedPublication={setSelectedPublication}
                />

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
                            <Button text="Создать" handleButton={goToPublicationPage}/>
                        </div>
                    </div>
                </Modal>

                {
                    (sessionStorage.getItem('user') !== null) &&
                    <Button text="Создать новую публикацию" handleButton={handleButton}/>
                }


                {!open &&
                    <Pagination
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginX: 'auto',
                        }}
                        color="primary"
                        count={totalPages}
                        page={pageNumber}
                        onChange={(_, num) => {
                            setPageNumber(num);
                        }}
                    />
                }

            </div>

        </div>
    );

}

export default Publications;