import {useState} from "react";
import Button from "../buttons/Button";
import axios from "../../config/axios";
import {useNavigate} from "react-router-dom";

const LoginForm = () => {

    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [secondPassword, setSecondPassword] = useState('');
    const [showLoginInput, setShowLoginInput] = useState(false);
    const [showSecondPassword, setShowSecondPassword] = useState(false);
    const [registrationMode, setRegistrationMode] = useState(false);


    const handleLogin = (event) => {
        event.preventDefault();
        if (registrationMode === false) {
            if (!email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
                alert("email не подходит по формату");
            }
            else if (email === '') {
                alert("Почему почта пустая?")
            }
            else if (password === '') {
                alert("Почему пароль пустой?");
            }

            else {
                return axios.post('/auth/login', {email: email, password: password}, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                })
                    .then((response) => {
                        sessionStorage.setItem('user', JSON.stringify(response.data));
                        navigate('/courses');
                        return response.data;
                    })
                    .catch((error) => {
                        console.log(error.response.data.message);
                        return error;
                    })
            }


        }
    }

    const handleRegistration = (event) => {
        event.preventDefault();
        if (registrationMode === true) {
            if (!email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
                alert("email не подходит по формату");
            }
            else if (email === '') {
                alert("Почему почта пустая?")
            }
            else if (login === '') {
                alert("Почему логин пустой?")
            }
            else if (password === '') {
                alert("Почему пароль пустой?");
            }
            else if (password.length < 5) {
                alert("Пароль должен быть не меньше 5 символов")
            }
            else if (password !== secondPassword) {
                alert("Пароли не совпадают");
            }
            else {
                return axios.post('/auth/register', {nickname: login, email: email, password: password}, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                })
                    .then((response) => {
                        sessionStorage.setItem('user', JSON.stringify(response.data));
                        navigate('/courses');
                        return response.data;
                    })
                    .catch((error) => {
                        console.log(error.response.data.message);
                        return error;
                    })

            }
        }
    }

    const goToRegistration = (e) => {
        e.preventDefault()
        setPassword('');
        setEmail('');
        setSecondPassword('');
        setLogin('');
        setShowLoginInput(true);
        setShowSecondPassword(true);
        setRegistrationMode(true);
    }

    const goToApp = () => {
        navigate('/courses');
    }

    const goToLogin = (e) => {
        e.preventDefault();
        setPassword('');
        setEmail('');
        setSecondPassword('');
        setLogin('');
        setShowLoginInput(false);
        setShowSecondPassword(false);
        setRegistrationMode(false);
    }

    return (
        <div className="flex justify-center mt-[300px] font-black text-xl">
            <div>
                <form>
                    <label>
                        <input className="border-2 flex mb-2" type="email" placeholder="Почта"
                               id="email" value={email} onChange={e => setEmail(e.target.value)}/>
                        {showLoginInput &&
                            <input className="border-2 flex mb-2" type="text" placeholder="Логин"
                                   id="login" value={login} onChange={e => setLogin(e.target.value)}/>
                        }
                        <input className="border-2 flex mb-2" type="password" placeholder="Пароль"
                               id="password" value={password} onChange={e => setPassword(e.target.value)}/>
                        {showSecondPassword &&
                            <input className="border-2 flex mb-2" type="password" placeholder="Повторите пароль"
                                   id="secondPassword" value={secondPassword}
                                   onChange={e => setSecondPassword(e.target.value)}/>
                        }
                        {showLoginInput && showSecondPassword &&
                            <Button text="Регистрация" handleButton={e => handleRegistration(e)}/>
                        }
                        {registrationMode === false &&
                            <Button text="Войти" handleButton={e => handleLogin(e)}/>
                        }
                        {registrationMode === false &&
                            <Button text="Перейти к регистрации" handleButton={e => goToRegistration(e)}/>
                        }
                        {registrationMode === true &&
                            <Button text="Перейти ко входу" handleButton={e => goToLogin(e)}/>
                        }

                    </label>
                </form>
                <div className="flex justify-center mt-5">
                    <a href=""
                       className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                       onClick={goToApp}>
                        Продолжить как гость
                    </a>
                </div>
            </div>
        </div>
    )
}

export default LoginForm;