import {useNavigate, useParams} from "react-router-dom";
import Header from "../components/headers/Header";
import Button from "../components/buttons/Button";
import {useEffect, useState} from "react";
import ProfileItem from "../components/items/ProfileItem";
import {Pagination} from "@mui/material";
import axios from "../config/axios";

const Profile = () => {
    const {nickname} = useParams();
    const [profileId, setProfileId] = useState();
    const [profilePhoto, setProfilePhoto] = useState();
    const [newPhoto, setNewPhoto] = useState([]);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [updatingNickname, setUpdatingNickname] = useState(nickname);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [isBanned, setIsBanned] = useState();
    const [profilePhotoName, setProfilePhotoName] = useState('');

    const [editMode, setEditMode] = useState(false);

    const [description, setDescription] = useState('');

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const notDefined = 'Не указано';

    const [users, setUsers] = useState([]);

    const [responseProfilePhoto, setResponseProfilePhoto] = useState([]);


    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);

    const [chronos, setChronos] = useState([]);
    const [selectedChrono, setSelectedChrono] = useState(15);

    const ownPersonProfile = () => {
        if (sessionStorage.getItem('user') === null) {
            return false;
        }
        return nickname === JSON.parse(sessionStorage.getItem('user')).nickname;
    }

    const goToProfile = (nickname) => {
        console.log(nickname);
        navigate('/users/' + nickname);
        window.location.reload();
    }


    useEffect(() => {

        if (JSON.parse(sessionStorage.getItem('user')) === null) {
            setIsAdmin(false);
        } else if (JSON.parse(sessionStorage.getItem('user')).role === 'Администратор') {
            setIsAdmin(true);
        }

        for (let i = 0; i < 59; i++) {
            chronos.push(i + 1);
        }

        const getProfileInfo = () => {
            return axios
                .get('/accounts/' + nickname, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                })
                .then((response) => {
                    if (response.data.is_banned === true && ownPersonProfile()) {
                        axios
                            .post('/auth/logout', null, {
                                headers: {
                                    "Access-Control-Allow-Origin": "*"
                                },
                                withCredentials: true
                            })
                            .then((response) => {
                                sessionStorage.clear();
                                ;
                                navigate('/');
                            })
                            .catch((error) => {
                                return error;
                            })
                        navigate('/');
                    }
                    return response.data;
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        navigate('/');
                    } else if (error.response.status === 404) {
                        navigate('/not-found');
                    }
                    return error.response.data;
                })
        }

        const getAllUsers = () => {
            console.log("AAAAAAAAAAAAAAAAAAAAAa - ", pageNumber);
            return axios
                .get('/accounts', {
                    params: {
                        pageNumber: pageNumber - 1,
                        pageSize: pageSize
                    },
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                })
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        if (error.response.message === "У вас недостаточно прав для выполнения данного действия") {
                            console.log(error.response);
                        } else return axios
                            .post('/auth/logout', null, {
                                headers: {
                                    "Access-Control-Allow-Origin": "*"
                                },
                                withCredentials: true
                            })
                            .then((response) => {
                                sessionStorage.clear();
                                navigate('/');
                                return response.data;
                            })
                            .catch((error) => {
                                return error;
                            })
                    }
                    return error;
                })
        }

        const getProfileData = async () => {
            let info = await getProfileInfo();
            console.log(info);
            console.log(ownPersonProfile());
            setIsBanned(info.is_banned);
            setProfileId(info.id);
            setName(info.first_name === null ? '' : info.first_name);
            setLastName(info.last_name === null ? '' : info.last_name);
            setMiddleName(info.middle_name === null ? '' : info.middle_name);
            setUpdatingNickname(info.nickname);
            setEmail(info.email);
            setBirthdate(info.birth_date);
            setRole(info.role);
            setProfilePhotoName(info.photo_name_in_directory);
            if (info.role === 'Администратор') {
                let users = await getAllUsers();
                setTotalPages(users.totalPages);
                console.log(users.content);
                setUsers(users.content);
            }

            let profilePhoto = await getProfilePhoto(info.photo_name_in_directory);
            console.log('ТЕст фото' + profilePhoto)
            setProfilePhoto(profilePhoto);

        }

        const getProfilePhoto = (photo_name_in_directory) => {
            if (photo_name_in_directory !== null) {
                return axios
                    .get('/photos/' + photo_name_in_directory, {
                        headers: {
                            "Access-Control-Allow-Origin": "*"
                        },
                        withCredentials: true
                    })
                    .then((response) => {

                        const files = [];

                        const file = new File([response.data], photo_name_in_directory, {
                            type: 'image/' + photo_name_in_directory.split('.').pop()
                        });

                        files.push(file);
                        setResponseProfilePhoto(files);
                        return "http://localhost:8080/v1/photos/" + photo_name_in_directory;
                    })
                    .catch((error) => {
                        if (error.response.status === 403) {
                            if (error.response.message === "У вас недостаточно прав для выполнения данного действия") {
                                console.log(error.response);
                            } else return axios
                                .post('/auth/logout', null, {
                                    headers: {
                                        "Access-Control-Allow-Origin": "*"
                                    },
                                    withCredentials: true
                                })
                                .then((response) => {
                                    sessionStorage.clear();
                                    navigate('/');
                                    return response.data;
                                })
                                .catch((error) => {
                                    return error;
                                })
                        }
                        return error;
                    })
            }
        }

        getProfileData().catch(console.error);

    }, [pageNumber, pageSize]);


    const handleProfilePhoto = (e) => {
        let newPhoto = e.target.files;
        console.log(newPhoto[0]);
        const validExtension = ['jpg', 'png'];
        const maxSize = 5 * 1024 * 1024;
        const fileExtension = newPhoto[0].name.split('.').pop().toLowerCase();
        const photo = [];

        let valid = validExtension.includes(fileExtension);
        let validSize = !(newPhoto.size > maxSize);

        if (!valid) {
            alert(`"Файл ${newPhoto[0].name} имеет неверное расширение. Допустимые расширения: ${validExtension.join(', ')}"`);
        }

        if (!validSize) {
            alert(`"Файл ${newPhoto.name} превышает допустимый размер (5 MB)."`);
        }

        if (valid && validSize) {
            setProfilePhoto(URL.createObjectURL(newPhoto[0]));
            photo.push(newPhoto[0]);
            setNewPhoto(photo);
        }

    }

    const handleEditMode = () => {
        setEditMode(true);
    }

    const handleChrono = (event) => {
        setSelectedChrono(parseInt(event.target.value));
    }

    const updateInfo = () => {
        setEditMode(false);
        const formData = new FormData();
        if (name === '') {
            alert('ЧЗХ, имя пустое');
        }
        else if (lastName === '') {
            alert('ЧЗХ, фамилия пустая');
        }
        else if (middleName === '') {
            alert('ЧЗХ, отчество пустое');
        }
        else {

            formData.append('nickname', updatingNickname);
            formData.append('firstName', name);
            formData.append('lastName', lastName);
            formData.append('middleName', middleName);
            if (birthdate !== '') {
                formData.append('birthDate', birthdate);
            }
            formData.append('description', description);
            if (newPhoto[0] !== undefined) {
                formData.append('photo', newPhoto[0]);
            }

            return axios
                .put('/accounts', formData, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                })
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        if (error.response.message === "У вас недостаточно прав для выполнения данного действия") {
                            console.log(error.response);
                        } else return axios
                            .post('/auth/logout', null, {
                                headers: {
                                    "Access-Control-Allow-Origin": "*"
                                },
                                withCredentials: true
                            })
                            .then((response) => {
                                sessionStorage.clear();
                                ;
                                navigate('/');
                                return response.data;
                            })
                            .catch((error) => {
                                return error;
                            })
                    }
                    return error.response.data;
                });
        }
    }

    const deleteUser = (user) => {
        const id = user.id;

        const is_banned = user.is_banned;

        const url = '/accounts/' + id;
        const method = is_banned ? '/unban' : '/ban';

        console.log(url);

        return axios
            .post(url + method, {}, {
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                withCredentials: true
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    if (error.response.message === "У вас недостаточно прав для выполнения данного действия") {
                        console.log(error.response);
                    } else return axios
                        .post('/auth/logout', null, {
                            headers: {
                                "Access-Control-Allow-Origin": "*"
                            },
                            withCredentials: true
                        })
                        .then((response) => {
                            sessionStorage.clear();
                            ;
                            navigate('/');
                            return response.data;
                        })
                        .catch((error) => {
                            return error;
                        })
                }
                return error.response.data;
            })

    }

    const setNewJobTime = () => {
        return axios
            .post('/scheduler', {minutes: selectedChrono}, {
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                withCredentials: true
            })
            .then((response) => {
                setSelectedChrono(response.data.minutes);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    if (error.response.message === "У вас недостаточно прав для выполнения данного действия") {
                        console.log(error.response);
                    } else return axios
                        .post('/auth/logout', null, {
                            headers: {
                                "Access-Control-Allow-Origin": "*"
                            },
                            withCredentials: true
                        })
                        .then((response) => {
                            sessionStorage.clear();
                            ;
                            navigate('/');
                            return response.data;
                        })
                        .catch((error) => {
                            return error;
                        })
                }
                return error;
            })
    }

    const banProfile = () => {

        const url = '/accounts/' + profileId;
        const method = isBanned ? '/unban' : '/ban';

        console.log(url);

        return axios
            .post(url + method, {}, {
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                withCredentials: true
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    if (error.response.message === "У вас недостаточно прав для выполнения данного действия") {
                        console.log(error.response);
                    } else return axios
                        .post('/auth/logout', null, {
                            headers: {
                                "Access-Control-Allow-Origin": "*"
                            },
                            withCredentials: true
                        })
                        .then((response) => {
                            sessionStorage.clear();
                            ;
                            navigate('/');
                            return response.data;
                        })
                        .catch((error) => {
                            return error;
                        })
                }
                return error;
            })

    }

    return (
        <div>
            <Header/>
            <div className="h-[40vh] flex">
                <div className="w-[20vh] bg-gray-300 rounded-2xl justify-center ml-2">
                    <div className="flex mb-auto m-2">
                        {profilePhoto !== undefined &&
                            <img id="profilePhoto" src={profilePhoto} width="200" height="200"/>
                        }
                        {
                            profilePhoto === undefined &&
                            <div>
                                no photo
                            </div>
                        }
                    </div>
                    {
                        editMode &&
                        <div className="flex justify-center mt-2">
                            <input id="input-file" type="file" onChange={e => handleProfilePhoto(e)}/>
                        </div>
                    }
                </div>
                <div className="flex-сol bg-gray-300 rounded-2xl w-[100%] ml-2 mr-2">
                    <div className="ml-3">
                        <div className="flex">
                            <div className="flex h-[5vh] text-2xl">
                                Данные профиля
                            </div>
                            {
                                isAdmin &&
                                <div className="flex ml-auto mr-3 ">
                                    <div className="mt-3 mr-1">
                                        Установить частоту чистки комментариев (в минутах)
                                    </div>

                                    <select value={selectedChrono} onChange={handleChrono}
                                            className="rounded-2xl w-[7%] h-[70%] mt-2 mr-3">
                                        {
                                            chronos.map((period) => {
                                                return (
                                                    <option key="period" value={period}>
                                                        {period}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    <Button text="Установить" handleButton={setNewJobTime}/>
                                </div>
                            }
                        </div>

                        <ProfileItem title="Фамилия"
                                     editMode={editMode}
                                     content={lastName}
                                     setNewValue={setLastName}
                        />

                        <ProfileItem title="Имя"
                                     editMode={editMode}
                                     content={name}
                                     setNewValue={setName}
                        />

                        <ProfileItem title="Отчество"
                                     editMode={editMode}
                                     content={middleName}
                                     setNewValue={setMiddleName}
                        />

                        <ProfileItem title="Почта"
                            // editMode={editMode}
                                     content={email}
                            // setNewValue={setEmail}
                        />

                        <ProfileItem title="Никнейм"
                            // editMode={editMode}
                                     content={updatingNickname}
                            // setNewValue={setUpdatingNickname}
                                     onClick={goToProfile}
                        />

                        <ProfileItem title="Статус"
                                     content={isBanned ? "Забанен" : "Не забанен"}
                        />


                        <div className="flex">
                            <div>
                                Роль - {role}
                            </div>
                        </div>

                        <div className="flex">
                            <label>
                                Дата рождения:
                                {!editMode && <div>{birthdate}</div>}
                                {editMode &&
                                    <input
                                        type="date"
                                        value={birthdate}
                                        className="ml-3"
                                        onChange={(e) => setBirthdate(e.target.value)}
                                    />
                                }
                            </label>
                        </div>

                        {!editMode && ownPersonProfile() === true &&
                            <Button text="Редактировать профиль" handleButton={handleEditMode}/>
                        }

                        {editMode && ownPersonProfile() === true &&
                            <Button text="Сохранить изменения" handleButton={updateInfo}/>
                        }
                        {
                            isAdmin && !ownPersonProfile() &&
                            <Button text={isBanned ? "Разбанить" : "Забанить"} handleButton={banProfile}/>
                        }
                    </div>

                </div>
            </div>
            {
                isAdmin && ownPersonProfile() &&

                <div className="h-[50vh] mt-3 flex-сol bg-gray-300 rounded-2xl w-[99%] ml-2 mr-2">
                    <div className="flex justify-center text-2xl">
                        Панель мониторинга пользователей
                    </div>
                    <div className="flex justify-center">
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[45%]">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead
                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        id
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Почта
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Никнейм
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Статус
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Забанить/разбанить
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    users.map((user) => {
                                        return (
                                            <tr key={user.id}
                                                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                <th scope="row"
                                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {user.id}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 cursor-pointer"
                                                    onClick={e => goToProfile(user.nickname)}>
                                                    {user.nickname}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.is_banned ? "Забанен" : "Не забанен"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a href="#"
                                                       className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                       onClick={e => deleteUser(user)}>
                                                        {user.is_banned ? "Разбанить" : "Забанить"}
                                                    </a>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {!!totalPages &&
                        <Pagination
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginX: 'auto',
                            }}
                            style={{
                                width: "99%",
                                position: "absolute",
                                bottom: "5px",
                            }}
                            color="primary"
                            count={totalPages}
                            page={pageNumber}
                            onChange={(_, num) => {
                                setPageNumber(num);
                            }}
                        />
                    }
                </div>
            }

        </div>
    )
}

export default Profile;