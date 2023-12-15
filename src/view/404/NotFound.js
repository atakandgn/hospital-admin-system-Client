import React from 'react';
import "../../App.css"
import DefaultLayout from "../Layout/DefaultLayout";
import {Link} from "react-router-dom";


export default function NotFound() {
    return (
        <DefaultLayout>
            <div className="error">404</div>
            <br /><br />
            <span className="info">Page NOT Found</span>
            <Link to="/">
                <button className="info backhome">Back to Home</button>
            </Link>
            <img alt="" src="http://images2.layoutsparks.com/1/160030/too-much-tv-static.gif" className="static" />
        </DefaultLayout>
    )
}