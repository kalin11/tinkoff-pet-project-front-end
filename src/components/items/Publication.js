const Publication = ({publicationId, publicationDesc}) => {
    return (

        <div key={publicationId} className="mb-4 rounded-[1px] bg-red-400">
            {publicationDesc}
        </div>
    );
}

export default Publication;