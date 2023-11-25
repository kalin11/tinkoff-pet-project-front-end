import React from "react";

const Button = ({text, handleButton}) => {

    const handleClick = (event) => {
        handleButton(event);
    }

    return (
        <div className="mx-auto w-[200px] text-center rounded-3xl bg-gray-200 cursor-pointer mb-3 mt-3">
            <button onClick={handleClick}>
                {text}
            </button>
        </div>
    );
}

export default Button;