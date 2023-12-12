import {useEffect, useState} from "react";
import axios from "../config/axios";
import Header from "../components/headers/Header";
import SubjectItemList from "../components/items/SubjectItemList";
import SubjectForm from "../components/form/SubjectForm";
import {Pagination} from "@mui/material";
import {useNavigate, useSearchParams} from "react-router-dom";

const Subject = ({subjects, setSubjects, selectedSubject, setSelectedSubject}) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (JSON.parse(sessionStorage.getItem('user')) === null) {
            setIsAdmin(false);
        } else if (JSON.parse(sessionStorage.getItem('user')).role === 'Администратор') {
            setIsAdmin(true);
        }
    }, []);

    useEffect(() => {
        console.log(searchParams.get('course'));
        const getSubjects = () => {
            return axios
                .get('/subjects', {
                    params:
                        {
                            pageNumber: pageNumber - 1,
                            pageSize: pageSize,
                            course: parseInt(searchParams.get('course'))
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
                                navigate('/');
                                return response.data;
                            })
                            .catch((error) => {
                                return error;
                            })
                    }
                    return error;
                });
        }

        const getData = async () => {
            let subjects = await getSubjects();

            setTotalPages(subjects.total_pages);


            let list = [];
            for (let i = 0; i < subjects.content.length; i++) {
                let id = subjects.content[i].id;
                let name = subjects.content[i].name;

                list.push(
                    {
                        id: id,
                        name: name
                    }
                );
            }
            setSubjects(list);

        }
        getData().catch(console.error);

    }, [pageNumber, pageSize,])

    return (
        <div>
            <Header/>
            <div className="mt-[200px]">
                <SubjectItemList subjects={subjects}
                                 selectedSubject={selectedSubject}
                                 setSelectedSubject={setSelectedSubject}/>

                {
                    isAdmin &&
                    <SubjectForm courseNumber={searchParams.get('course')}/>
                }

                {!!totalPages &&
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
    )
}

export default Subject;