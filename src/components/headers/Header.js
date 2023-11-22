import React from "react";
import "./Header.css";

const Header = () => {
    return (
        <div className="flex-col">
            <header className="flex justify-center sticky z-50 bg-purple-300 top-0 p-4 text-xl">Платформа для студентов</header>
        </div>
    );
}

export default Header;