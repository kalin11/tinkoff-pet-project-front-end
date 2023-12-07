import Header from "../components/headers/Header";
import Button from "../components/buttons/Button";
import {useNavigate} from "react-router-dom";

const Feed = () => {

    const navigate = useNavigate();

    const goToCourses = () => {
        navigate('/courses');
    }

    return (
        <div>
            <Header/>
            <div className="flex-col ml-[85%]">
                <Button text="Перейти в старый функционал" handleButton={goToCourses}/>
            </div>
        </div>
    )
}

export default Feed;