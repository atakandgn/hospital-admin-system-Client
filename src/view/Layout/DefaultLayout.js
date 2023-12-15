import React from "react";
import "../../App.css"
import Footer from "../../components/Footer/Footer";
// import ScrollTop from "../Components/Extra/ScrollTop";


function MainLayout({children}) {
    return (
        <div>
            <div className="min-h-[80vh] lg:px-0">{children}</div>
            {/*<ScrollTop/>*/}
            <Footer className="fixed bottom"/>
        </div>
    )
}

export default MainLayout;