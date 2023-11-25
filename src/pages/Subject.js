import {useEffect, useState} from "react";
import axios from "../config/axios";
import Header from "../components/headers/Header";
import SubjectItemList from "../components/items/SubjectItemList";
import SubjectForm from "../components/form/SubjectForm";
import {Pagination} from "@mui/material";
import {useSearchParams} from "react-router-dom";

const Subject = ({subjects, setSubjects, selectedSubject, setSelectedSubject}) => {

    const [searchParams, setSearchParams] = useSearchParams();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        console.log(searchParams.get('course'));
        const getSubjects = () => {
            return axios
                .get('/subjects', {params: {pageNumber: pageNumber - 1, pageSize: pageSize, course: parseInt(searchParams.get('course'))}})
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    return error;
                });
        }

        const getData = async () => {
            let subjects = await getSubjects();

            setTotalPages(subjects.totalPages);


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
                {!!totalPages &&
                    <Pagination
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginX: 'auto',
                        }}
                        style={{
                            width: "100%",
                            position: "absolute",
                            bottom: "5px",
                        }} color="primary"
                        count={totalPages}
                        page={pageNumber}
                        onChange={(_, num) => {
                            setPageNumber(num);
                        }}

                    />
                }

                <SubjectForm courseNumber={searchParams.get('course')}/>

            </div>
        </div>
    )
}

export default Subject;