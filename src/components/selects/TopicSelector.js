import React from "react";

const TopicSelector = ({topics, selectedTopic, handleSelectedTopic}) => {

    const handleTopicChange = (event) => {
        handleSelectedTopic(event.target.value);
    }

    return (
        <div className="min-w-[900px] max-w-[80vw] mx-auto flex justify-center">

            <div>
                <p>Выберите топик</p>
            </div>

            <div className="ml-3">
                <select value={selectedTopic} onChange={handleTopicChange}>
                    {
                        topics.map((topic) => {
                            return (
                                <option key={topic.id} value={topic.id}>
                                    {topic.topic_type}
                                </option>
                            )

                        })
                    }
                </select>
            </div>


        </div>
    );
}

export default TopicSelector;