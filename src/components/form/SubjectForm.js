import Button from "../buttons/Button";
import "./Form.css"
import {useState} from "react";
import axios from "axios";

const SubjectForm = () => {

    const [subjectTitle, setSubjectTitle] = useState('');

    const url = axios.create({
        baseURL: 'http://localhost:8080/v1/',
    });

    const createNewSubject = (event) => {
        event.preventDefault();
        console.log(subjectTitle);

        return url
            .post('/subjects', {name: subjectTitle})
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                return error;
            });

    }

    return (
        <div className="form min-w-[900px] max-w-[80vw] mx-auto flex justify-center">
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