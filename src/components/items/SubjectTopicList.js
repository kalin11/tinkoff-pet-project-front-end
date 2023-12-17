import {useNavigate} from "react-router-dom";
import TopicItem from "./TopicItem";

const SubjectTopicList = ({topics, setSelectedTopic, selectedSubjectTopicId, setSubjectTopicId}) => {
    const navigate = useNavigate();

    const handleSelectedTopic = (id, topicId) => {
        console.log(id);
        console.log(topicId);
        setSubjectTopicId(id);
        setSelectedTopic(topicId);
        navigate('/publications')
    }

    return (
        <div className="list min-w-[900px] max-w-[80vw] mx-auto flex justify-center">
            <ul>
                {
                    topics.map((currTopic) => {
                        return (
                            <TopicItem key={currTopic.topic.id}
                                       subjectTopicId={currTopic.id}
                                       topicId={currTopic.topic.id}
                                       topicName={currTopic.topic.topic_type}
                                       handleClick={handleSelectedTopic}
                                       >
                            </TopicItem>

                        )
                    })
                }
            </ul>
        </div>
    )
}

export default SubjectTopicList;