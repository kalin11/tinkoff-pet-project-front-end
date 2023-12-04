import axios from "../config/axios";
import {useEffect, useState} from "react";
import Header from "../components/headers/Header";
import SubjectTopicForm from "../components/form/SubjectTopicForm";
import SubjectTopicList from "../components/items/SubjectTopicList";
import {useNavigate, useParams} from "react-router-dom";

const SubjectTopic = ({
                          topics,
                          setTopics,
                          topicType,
                          setSelectedTopicType,
                          course,
                          allTopics,
                          setAllTopics,
                          subjectTopicId,
                          setSubjectTopicId
                      }) => {

    const {id} = useParams();

    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const [totalPages, setTotalPages] = useState(10);
    const navigate = useNavigate();

    const [isBanned, setIsBanned] = useState(false);

    useEffect(() => {

        const getTopics = () => {
            console.log(id);
            return axios
                .get('/subject-topics',
                    {
                        params: {
                            pageNumber: pageNumber,
                            pageSize: pageSize,
                            subjectId: parseInt(id)
                        },
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

                                ;
                                setIsBanned(true);
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

        const getAllTopics = () => {
            return axios
                .get('/topics',
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
                                setIsBanned(true);
                                navigate('/');
                                return response.data;
                            })
                            .catch((error) => {
                                return error;
                            })
                    }
                    return error;
                })
        };

        const getDataAllTopics = async () => {
            let allTopics = await getAllTopics();
            setAllTopics(allTopics);
        }

        const getData = async () => {
            let topics = await getTopics();
            console.log(topics);
            let list = [];
            for (let i = 0; i < topics.content.length; i++) {
                let subject_topic_id = topics.content[i].id;
                let id = topics.content[i].topic.id;
                let topic_type = topics.content[i].topic.topic_type;
                list.push(
                    {
                        id: subject_topic_id,
                        topic: {
                            id,
                            topic_type
                        }
                    }
                );
            }
            setTopics(list);
        }

        getData().catch(console.error);
        getDataAllTopics().catch(console.error);
    }, []);

    return (
        <div>
            <Header/>
            <div className="mt-[200px]">
                {!isBanned &&
                    <SubjectTopicList topics={topics}
                                      selectedTopic={topicType}
                                      setSelectedTopic={setSelectedTopicType}
                                      setSubjectTopicId={setSubjectTopicId}
                                      selectedSubjectTopicId={subjectTopicId}
                    />
                }
                {
                    (sessionStorage.getItem('user') !== null) &&
                    <SubjectTopicForm topics={allTopics}
                                      selectedTopic={topicType}
                                      setSelectedTopic={setSelectedTopicType}
                                      course={course}
                                      subjectId={id}/>
                }

            </div>
        </div>
    )

}

export default SubjectTopic;