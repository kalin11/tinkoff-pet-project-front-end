import {BrowserRouter, Route, Routes} from 'react-router-dom';

// pages
import About from './pages/About';
import NotFound from './pages/NotFound';
import Course from "./pages/Course";
import {useState} from "react";
import Subject from "./pages/Subject";
import SubjectTopic from "./pages/SubjectTopic";
import Publications from "./pages/Publications";
import Publication from "./pages/Publication";
import LoginForm from "./components/form/LoginForm";
import Profile from "./pages/Profile"
import Feed from "./pages/Feed";


const App = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(1);

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState();

    const [topics, setTopics] = useState([]);
    const [topicType, setTopicType] = useState(1);

    const [allTopics, setAllTopics] = useState([]);

    const [subjectTopicId, setSubjectTopic] = useState(1);

    const [publications, setPublications] = useState([]);
    const [selectedPublication, setSelectedPublication] = useState();

    const [currentUserEmail, setCurrentUserEmail] = useState();

    const handleSelectedPublication = (value) => {
        setSelectedPublication(parseInt(value));
    }

    const handleSelectCourse = (value) => {
        setSelectedCourse(parseInt(value));
    }

    const handleSelectedSubject = (value) => {
        setSelectedSubject(value);
    }

    const handleSelectedTopicType = (value) => {
        setTopicType(parseInt(value));
    }

    const handleSelectedSubjectTopic = (value) => {
        setSubjectTopic(value);
    }

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/"
                           element={<LoginForm/>}
                    />
                    <Route exact path="/courses"
                           element={<Course courses={courses} selectedCourse={selectedCourse}
                                            handleSelectCourse={handleSelectCourse} setCourses={setCourses}/>}
                    />
                    <Route path="/subjects"
                           element={<Subject subjects={subjects} setSubjects={setSubjects}
                                             selectedSubject={selectedSubject}
                                             setSelectedSubject={handleSelectedSubject}/>}
                    />
                    <Route path="/subject-topics/:id"
                           element={<SubjectTopic topics={topics}
                                                  setTopics={setTopics}
                                                  topicType={topicType}
                                                  setSelectedTopicType={handleSelectedTopicType}
                                                  course={selectedCourse}
                                                  allTopics={allTopics}
                                                  setAllTopics={setAllTopics}
                                                  subjectTopicId={subjectTopicId}
                                                  setSubjectTopicId={handleSelectedSubjectTopic}

                           />}
                    />
                    <Route exact path="/publications"
                           element={<Publications subjectTopicId={subjectTopicId}
                                                  publications={publications}
                                                  setPublications={setPublications}
                                                  selectedPublication={selectedPublication}
                                                  setSelectedPublication={handleSelectedPublication}
                           />}
                    />
                    <Route path="/publications/:id"
                           element={<Publication/>}
                    />
                    <Route path="/users/:nickname"
                           element={<Profile/>}
                    />
                    <Route path="/feed"
                           element={<Feed/>}
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
