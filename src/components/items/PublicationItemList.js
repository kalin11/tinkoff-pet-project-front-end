import {useNavigate} from "react-router-dom";
import PublicationItem from "./PublicationItem";

const PublicationItemList = ({publications, selectedPublication, setSelectedPublication}) => {

    const navigate = useNavigate();

    const handlePublication = (id) => {
        setSelectedPublication(id);
        navigate('/publications/' + id);
        console.log(selectedPublication);
    }

    return (
        <div className="min-w-[900px] max-w-[80vw] mx-auto justify-center">
            {
                publications.map((publication) => {
                    return (
                        <PublicationItem key={publication.id}
                                         publicationId={publication.id}
                                         publicationTitle={publication.title}
                                         handleClick={handlePublication}

                        />
                    );
                })
            }
        </div>
    )

}

export default PublicationItemList;
