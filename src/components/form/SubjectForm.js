import Button from "../buttons/Button";
import {useState} from "react";
import axios from "../../config/axios";

const SubjectForm = ({ courseNumber }) => {

    const [subjectTitle, setSubjectTitle] = useState('');


    const createNewSubject = (event) => {
        event.preventDefault();
        console.log(subjectTitle);
        if (subjectTitle === '') {
            alert('Почему название предмета пустое?');
            return false;
        }
        else {
            return axios
                .post('/subjects',
                    {
                        course_number: courseNumber,
                        name: subjectTitle
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
                    console.log(error);
                    return error;
                });
        }

    }

    return (
        <div className="min-w-[900px] max-w-[80vw] mx-auto flex justify-center">
            <form>
                <label>
                    <input className="border-2 border-purple-300" type="text" placeholder="Название продукта"
                           id="subjectName" value={subjectTitle} onChange={e => setSubjectTitle(e.target.value)}/>
                </label>
                <Button text="Создать предмет" handleButton={createNewSubject}/>
            </form>
        </div>
    )
}

export default SubjectForm;