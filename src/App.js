import {BrowserRouter, Route, Routes} from 'react-router-dom';

// pages
import About from './pages/About';
import NotFound from './pages/NotFound';
import Course from "./pages/Course";
import {useState} from "react";
import Subject from "./pages/Subject";
import SubjectTopic from "./pages/SubjectTopic";
import Publications from "./pages/Publications";


const App = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(1);

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState();

    const [topics, setTopics] = useState([]);
    const [topicType, setTopicType] = useState(1);

    const [allTopics, setAllTopics] = useState([]);

    const [subjectTopic, setSubjectTopic] = useState(1);

    const handleSelectCourse = (value) => {
        setSelectedCourse(parseInt(value));
    }

    const handleSelectedSubject = (value) => {
        setSelectedSubject(value);
    }

    const handleSelectedTopicType = (value) => {
        setTopicType(parseInt(value));
    }

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/"
                           element={<Course courses={courses} selectedCourse={selectedCourse} handleSelectCourse={handleSelectCourse} setCourses={setCourses}/>}
                    />
                    <Route exact path="/subjects"
                           element={<Subject course={selectedCourse} subjects={subjects} setSubjects={setSubjects} selectedSubject={selectedSubject} setSelectedSubject={handleSelectedSubject}/>}
                    />
                    <Route exact path="/subject-topics"
                           element={<SubjectTopic topics={topics} setTopics={setTopics} topicType={topicType} setSelectedTopicType={handleSelectedTopicType} course={selectedCourse} subjectId={selectedSubject} allTopics={allTopics} setAllTopics={setAllTopics}/>}
                    />
                    <Route exact path="/publications"
                           element={<Publications topicType={topicType} courseNumber={selectedCourse} subjectId={selectedSubject}/>}
                    />
                    <Route exact path="/about" element={<About/>}
                    />
                    <Route path="*" element={<NotFound/>}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
