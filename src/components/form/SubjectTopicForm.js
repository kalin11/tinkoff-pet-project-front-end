import {useState} from "react";
import axios from "../../config/axios";
import TopicSelector from "../selects/TopicSelector";
import Button from "../buttons/Button";
import {useNavigate} from "react-router-dom";

const SubjectForm = ({topics, selectedTopic, setSelectedTopic, course, subjectId}) => {

    const [topicTitle, setTopicTitle] = useState('');

    const navigate = useNavigate();


    const handleTopicTitle = (event) => {
        event.preventDefault();
        setTopicTitle(event.target.value);
    }

    const createNewSubjectTopic = (event) => {
        event.preventDefault();
        console.log(event.target);

        return axios
            .post('/subject-topics',
                {
                    course_number: course,
                    subject_id: subjectId,
                    topic_id: selectedTopic
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
                console.log(error.response.data);
                return error.response.data;
            });

    }

    return (
        <div className="form min-w-[900px] max-w-[80vw] mx-auto flex justify-center">
            <form>
                <div className=" mt-[200px]">
                    <TopicSelector topics={topics} selectedTopic={selectedTopic}
                                   handleSelectedTopic={setSelectedTopic}/>
                    <Button text="Создать топик" handleButton={createNewSubjectTopic}/>
                </div>
            </form>
        </div>
    )
}

export default SubjectForm;