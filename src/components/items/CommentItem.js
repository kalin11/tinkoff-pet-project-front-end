const CommentItem = ( {username, createdDate, comment, commentId} ) => {
    return (
        <div className="bg-white rounded mt-3 mb-3" key={commentId}>
            <div>
                <div className="flex">
                    {username}
                </div>
                <div className="flex mt-3 mb-3">
                    {createdDate}
                </div>
            </div>
            <div className="flex">
                {comment}
            </div>

        </div>
    )
}

export default CommentItem;