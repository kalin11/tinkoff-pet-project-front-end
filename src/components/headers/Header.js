import React from "react";
import axios from "../../config/axios";
import {useNavigate} from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();

    const logout = () => {
        return axios
            .post('/auth/logout', null, {
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                withCredentials: true
            })
            .then((response) => {
                sessionStorage.clear(); /*;*/
                ;
                navigate('/');
                return response.data;
            })
            .catch((error) => {
                return error;
            })
    }

    const goToProfile = () => {
        navigate('/users/' + JSON.parse(sessionStorage.getItem("user")).nickname);
        window.location.reload();
    }

    return (
        <div className="flex-col">
            <header
                className="flex justify-center sticky z-50 mr-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-white top-0 p-4 text-xl">
                {sessionStorage.getItem("user") !== null &&
                    <div className="flex-col ml-auto">
                        <div className="cursor-pointer" onClick={goToProfile}>
                            {
                                JSON.parse(sessionStorage.getItem("user")).nickname
                            }
                        </div>
                        <div className="cursor-pointer" onClick={logout}>
                            {sessionStorage.getItem("user") !== '' && 'Выйти'}
                        </div>
                    </div>

                }
            </header>
        </div>
    );
}

export default Header;