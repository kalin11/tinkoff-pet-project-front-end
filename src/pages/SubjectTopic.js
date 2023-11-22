import axios from "axios";
import {useEffect} from "react";
import Header from "../components/headers/Header";
import SubjectTopicForm from "../components/form/SubjectTopicForm";
import SubjectTopicList from "../components/items/SubjectTopicList";

const url = axios.create({
    baseURL: 'http://localhost:8080/v1/',
});
const SubjectTopic = ({topics, setTopics, topicType, setSelectedTopicType, course, subjectId, allTopics, setAllTopics}) => {

    useEffect(() => {

        const get_topics = () => {
            return url
                .get('/subject-topics', {params: {course: course, subjectId: subjectId}})
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    return error;
                })
        }

        const get_all_topics = () => {
            return url
                .get('/topics')
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    return error;
                })
        };

        const get_data_all_topics = async () => {
            let allTopics = await get_all_topics();

            let list = [];
            for (let i = 0; i < allTopics.length; i++) {
                 let id = allTopics[i].id;
                 let type = allTopics[i].topic_type;
                 list.push(
                     {
                         id: id,
                         type: type
                     }
                 );
            }
            setAllTopics(allTopics);
            console.log(allTopics);
        }

        const get_data = async () => {
            let topics = await get_topics();

            let list = [];
            for (let i = 0; i < topics.length; i++) {
                let subject_topic_id = topics[i].id;
                let id = topics[i].topic.id;
                let topic_type = topics[i].topic.topic_type;
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
            console.log(list);
        }

        get_data().catch(console.error);
        get_data_all_topics().catch(console.error);
    }, []);

    return (
        <div>
            <Header/>
            <div className="mt-[200px]">
                <SubjectTopicList topics={topics} selectedTopic={topicType}
                                  setSelectedTopic={setSelectedTopicType}/>
                <SubjectTopicForm topics={allTopics} selectedTopic={topicType} setSelectedTopic={setSelectedTopicType}
                                  course={course} subjectId={subjectId}/>
            </div>
            {/*<Footer/>*/}
        </div>
    )

}

export default SubjectTopic;