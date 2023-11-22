import "./SubjectItemList.css"
import {useNavigate} from "react-router-dom";
const SubjectItemList = ({subjects, selectedSubject, setSelectedSubject}) => {

    const navigate = useNavigate();

    const handleSelectedSubject = (id) => {
        setSelectedSubject(id);
        navigate('/subject-topics')
    }

    return (
        <div className="list min-w-[900px] max-w-[80vw] mx-auto flex justify-center">
            <ul>
                {
                    subjects.map((subject) => {
                        return (
                            <li className="cursor-pointer" key={subject.id} onClick={() => handleSelectedSubject(subject.id)}>
                                {subject.name}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default SubjectItemList;