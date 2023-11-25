const SubjectItem = ({ subjectId, subjectName, handleClick }) => {

    const handle = () => {
        handleClick(subjectId);
    }

    return (
        <div className="cursor-pointer mx-auto mb-3 justify-items-center w-[80%]" key={subjectId} onClick={handle}>
            <div className="text-center block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{subjectName}</h5>
            </div>
        </div>
    )
}

export default SubjectItem;