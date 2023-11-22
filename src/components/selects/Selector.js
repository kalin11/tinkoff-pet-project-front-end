import React from "react";
import "./Selector.css";

const Selector = ({courses, selectedCourse, handleSelectCourse}) => {

    const handleCourseChange = (event) => {
        handleSelectCourse(event.target.value);
    }

    return (
        <div className="min-w-[900px] max-w-[80vw] mx-auto flex justify-center">

            <div>
                <p>Выберите курс</p>
            </div>

            <div className="ml-3">
                <select value={selectedCourse} onChange={handleCourseChange}>
                    {
                        courses.map((course) => {
                            return (
                                <option key={course.course_number} value={course.course_number}>
                                    {course.course_number}
                                </option>
                            )

                        })
                    }
                </select>
            </div>


        </div>
    );
}

export default Selector;