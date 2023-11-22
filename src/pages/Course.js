import Header from "../components/headers/Header";
import Selector from "../components/selects/Selector";
import {useEffect} from "react";
import axios from "../config/axios";
import Button from "../components/buttons/Button";
import {useNavigate} from "react-router-dom";

const Course = ({courses, selectedCourse, handleSelectCourse, setCourses}) => {

    const navigate = useNavigate();

    useEffect(() => {

        const get_courses = () => {
            return axios
                .get('/courses')
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    return error;
                });
        }

        const get_data = async () => {
            let courses = await get_courses();

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

        get_data().catch(console.error);

    }, [setCourses]);

    const handleButton = () => {
        navigate('/subjects');
    }

    return (
        <div className="">
            <Header/>
            <div className=" mt-[200px]">
                <Selector courses={courses} selectedCourse={selectedCourse} handleSelectCourse={handleSelectCourse}/>
                <Button text="Показать предметы" handleButton={handleButton}/>
            </div>
            {/*<Footer/>*/}
        </div>
    );
}

export default Course;