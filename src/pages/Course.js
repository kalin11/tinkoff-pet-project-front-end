import Header from "../components/headers/Header";
import Selector from "../components/selects/Selector";
import {useEffect} from "react";
import axios from "../config/axios";
import Button from "../components/buttons/Button";
import {useNavigate} from "react-router-dom";

const Course = ({courses, selectedCourse, handleSelectCourse, setCourses}) => {

    const navigate = useNavigate();

    useEffect(() => {

        const getCourses = () => {
            return axios
                .get('/courses', {
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
                        navigate('/');
                    }
                    return error;
                });
        }

        const getData = async () => {
            let courses = await getCourses();

            let list = [];
            for (let i = 0; i < courses.length; i++) {
                let course_number = courses[i].course_number;
                let desc = courses[i].description;
                list.push(
                    {
                        course_number: course_number,
                        description: desc
                    }
                );
            }

            setCourses(list);
        }

        getData().catch(console.error);

    }, [setCourses]);

    const handleButton = () => {
        navigate('/subjects?course=' + selectedCourse);
    }

    return (
        <div className="">
            <Header />
            <div className="mt-[200px]">
                <Selector courses={courses} selectedCourse={selectedCourse} handleSelectCourse={handleSelectCourse}/>
                <Button text="Показать предметы" handleButton={handleButton}/>
            </div>

        </div>
    );
}

export default Course;