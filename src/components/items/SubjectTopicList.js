import {useNavigate} from "react-router-dom";

const SubjectTopicList = ({topics, setSelectedTopic}) => {
    const navigate = useNavigate();

    const handleSelectedTopic = (id) => {
        setSelectedTopic(id);
        navigate('/posts')
    }

    return (
        <div className="list min-w-[900px] max-w-[80vw] mx-auto flex justify-center">
            <ul>
                {
                    topics.map((topic) => {
                        return (
                            <li className="cursor-pointer" key={topic.topic.id} onClick={() => handleSelectedTopic(topic.id)}>
                                {topic.topic.topic_type}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default SubjectTopicList;