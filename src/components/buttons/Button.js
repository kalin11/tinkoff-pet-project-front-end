import React from "react";
import "./Button.css";

const Button = ({text, handleButton}) => {

    const handleClick = (event) => {
        handleButton(event);
    }

    return (
        <div className="mx-auto w-[200px] text-center">
            <button onClick={handleClick}>
                {text}
            </button>
        </div>
    );
}

export default Button;