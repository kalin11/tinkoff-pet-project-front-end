import {useNavigate} from "react-router-dom";
import SubjectItem from "./SubjectItem";

const SubjectItemList = ({subjects, selectedSubject, setSelectedSubject}) => {

    const navigate = useNavigate();

    const handleSelectedSubject = (id) => {
        setSelectedSubject(id);
        navigate('/subject-topics/' + id);
    }

    return (
        <div className="min-w-[900px] max-w-[80vw] mx-auto justify-center">
            <ul>
                {
                    subjects.map((subject) => {
                        return (
                            <SubjectItem key={subject.id}
                                         subjectId={subject.id}
                                         subjectName={subject.name}
                                         handleClick={handleSelectedSubject}/>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default SubjectItemList;