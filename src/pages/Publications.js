import {useEffect} from "react";
import axios from "axios";

const url = axios.create({
    baseURL: 'http://localhost:8080/v1/'
});

const Publications = ({topicType, subjectId, courseNumber}) => {
    // useEffect(() => {
    //     const getPublications = () => {
    //         return url
    //             .post('/subject-topics', {course_number : courseNumber, subject_id : subjectId, topic_type : topicType})
    //             .then((response) => {
    //                 response.data;
    //             })
    //             .catch((error) => {
    //                 return error;
    //             })
    //     }
    // }, []);

    return (
      <div>

      </div>
    );

}

export default Publications;