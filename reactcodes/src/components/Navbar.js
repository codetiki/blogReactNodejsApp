import React from 'react';
import "./Navbar.css"
import { Link } from "react-router-dom";
const Navbar = () => {
    return (
        <header class="header">
            <div class="left">
                <a href="#">Blog Navbar</a>
            </div>
            <div class="mid">
                <ul class="navbar">

                    <li>
                        <Link to="/isi">Daddy</Link>
                    </li>
                    <li>
                        <Link to="/blog">Blog</Link>
                    </li>
                    <li>
                        <Link to="/post">Post</Link>
                    </li>
                </ul>

            </div>


        </header>
    );
}
export default Navbar;