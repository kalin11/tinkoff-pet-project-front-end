import {Fragment} from "react";
import {Link} from 'react-router-dom';
import HelloWorld from "../components/HelloWorld/HelloWorld";

const Home = () => {
    return (
        <Fragment>
            <HelloWorld />
            <p>This is Home page</p>

            <Link to="/about">Go to 'About' page</Link>
        </Fragment>
    );
}

export default Home;