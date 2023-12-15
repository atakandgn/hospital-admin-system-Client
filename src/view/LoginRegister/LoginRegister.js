import React, { useState } from 'react';
import '../../App.css';
import DefaultLayout from '../Layout/DefaultLayout';
import LoginForm from '../../components/Forms/LoginForm';
import { CSSTransition } from 'react-transition-group';
import 'animate.css/animate.css';
import SignUpForm from '../../components/Forms/SignUpForm';

export default function AuthenticateUser() {
    const [activeForm, setActiveForm] = useState('login');

    const toggleForm = () => {
        setActiveForm((prevForm) => (prevForm === 'login' ? 'signup' : 'login'));
    };

    return (
        <DefaultLayout>
            <div className="flex items-center justify-center min-h-screen">
                <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border">
                    <div className="relative grid mx-4 mb-4 -mt-6 overflow-hidden text-white shadow-lg h-28 place-items-center rounded-xl bg-gradient-to-tr from-gray-900 to-gray-800 bg-clip-border shadow-gray-900/20">
                        <h3 className="block font-sans text-3xl antialiased font-semibold leading-snug tracking-normal text-white">
                            {activeForm === 'login' ? 'Sign In' : 'Sign Up'}
                        </h3>
                    </div>

                    {/* Set a fixed height for the container */}
                    <div style={{ overflow: 'hidden' }}>
                        <CSSTransition
                            in={activeForm === 'login'}
                            timeout={500}
                            classNames="form"
                            unmountOnExit
                        >
                            <LoginForm toggleForm={toggleForm} />
                        </CSSTransition>

                        <CSSTransition
                            in={activeForm === 'signup'}
                            timeout={500}
                            classNames="form"
                            unmountOnExit
                        >
                            <SignUpForm toggleForm={toggleForm} />
                        </CSSTransition>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
