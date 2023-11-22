import {useEffect} from "react";
import axios from "axios";
import Header from "../components/headers/Header";
import SubjectItemList from "../components/items/SubjectItemList";
import SubjectForm from "../components/form/SubjectForm";

const url = axios.create({
    baseURL: 'http://localhost:8080/v1/'
});

const Subject = ({course, subjects, setSubjects, selectedSubject, setSelectedSubject}) => {


    useEffect(() => {
        const get_subjects = () => {
            return url
                .get('/subjects', {params: {course: course}})
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    return error;
                });
        }

        const get_data = async () => {
            let subjects = await get_subjects();

            let list = [];
            for (let i = 0; i < subjects.length; i++) {
                let id = subjects[i].id;
                let name = subjects[i].name;

                list.push(
                    {
                        id: id,
                        name: name
                    }
                );
            }

            setSubjects(list);
        }
        get_data().catch(console.error);

    }, [course, setSubjects])

    return (
        <div>
            <Header/>
            <div className="mt-[200px]">
                <SubjectItemList subjects={subjects} selectedSubject={selectedSubject}
                                 setSelectedSubject={setSelectedSubject}/>
                <SubjectForm/>
            </div>
            {/*<Footer/>*/}
        </div>
    )
}

export default Subject;