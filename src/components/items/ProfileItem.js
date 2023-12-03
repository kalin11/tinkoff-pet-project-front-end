const ProfileItem = ({ title, editMode, content, setNewValue}) => {

    const setContent = (value) => {
        setNewValue(value);
    }

    return (
        <div className="flex mb-2">
            <div className="mr-3">{title}</div>
            {!editMode &&
                <div className="flex">
                    <div>
                        {content}
                    </div>
                </div>
            }
            {editMode &&
                <div className="flex">
                    <input placeholder={title} type="text" value={content}
                           onChange={event => setContent(event.target.value)}/>
                </div>
            }
        </div>
    )
}

export default ProfileItem;