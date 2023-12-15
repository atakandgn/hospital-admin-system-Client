import React, {useEffect, useState} from 'react';
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';
import {Input} from "@material-tailwind/react";

const SignUpForm = ({toggleForm}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [occupationId, setOccupationId] = useState('');
    const [allOccupations, setAllOccupations] = useState([]);

    const handleSubmit = async () => {
        const registerData = {
            username: username,
            password: password,
            email: email,
            name: name,
            surname: surname,
            phone: phone,
            occupation_id: occupationId,
        };

        try {
            const response = await axios.post('http://localhost:5000/register', registerData);

            if (response.status === 201) {
                // Registration successful
                toast.success(response.data.message ? response.data.message : 'Registration successful. Redirecting...');
                // Redirect to login page after registration
                setTimeout(() => {
                    toast.success('Admin created successfully! Redirecting...');
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(response.data.message ? response.data.message : 'An error occurred during registration');
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
            toast.error('Registration failed!. Please check information and try again.');
        }
    };

    const fetchOccupations = async () => {
        try {
            // Make an Axios GET request to the occupations endpoint
            const response = await axios.get('http://localhost:5000/occupations');

            // Extract the data from the response
            const occupationsData = response.data;

            // Set the occupations in the state
            setAllOccupations(occupationsData);

        } catch (error) {
            // Handle errors, log them to the console, or display an error message
            console.error('Error fetching occupations:', error);
        }
    };

    useEffect(() => {
        fetchOccupations();
    }, []);


    return (
        <div className="flex flex-col gap-4 p-6">
            <Toaster position="top-center" reverseOrder={false}/>
            <div className="flex gap-4">
                {/* Name input */}
                <div className="relative h-11 w-full ">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        // Validate: allow only letters and spaces
                        pattern="[A-Za-z\s]+"
                        className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                        placeholder=" "
                    />
                    <label
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                    >
                        Name
                    </label>
                </div>

                {/* Surname input */}
                <div className="relative h-11 w-full ">
                    {/* Surname input and label */}
                    <input
                        type="text"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        // Validate: allow only letters and spaces
                        pattern="[A-Za-z\s]+"
                        className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                        placeholder=" "
                    />
                    <label
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                    >
                        Surname
                    </label>
                </div>
            </div>

            {/* Username input */}
            <div className="relative h-11 w-full min-w-[200px]">
                <Input
                    type="text"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    // Validate: allow only letters and spaces
                    pattern="[A-Za-z\s]+"
                    placeholder=" "
                />
            </div>

            {/*Email input*/}
            <div className="relative h-11 w-full min-w-[200px]">
                <Input
                    type="email"
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-20"
                    containerProps={{
                        className: "min-w-0",
                    }}
                />
            </div>


            {/* Phone input */}
            <div className="relative h-11 w-full min-w-[200px]">
                <Input
                    type="tel"
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder=" "
                />
            </div>

            {/* Occupation ID dropdown */}
            <div className="relative h-11 w-full min-w-[200px]">
                <select
                    value={occupationId}
                    onChange={(e) => setOccupationId(e.target.value)}
                    className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                >
                    <option value="" disabled hidden>Select Occupation</option>
                    {allOccupations.map(occupation => (
                        <option key={occupation.occupation_id} value={occupation.occupation_id}>
                            {occupation.occupation_name}
                        </option>
                    ))}
                </select>
                <label
                    className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                >
                    Occupation ID
                </label>
            </div>

            {/* Password input */}
            <div className="relative h-11 w-full min-w-[200px]">
                <Input
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder = " "
                />
            </div>

            {/* Submit button */}
            <button
                onClick={handleSubmit}
                className="block w-full select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
            >
                Sign Up
            </button>

            {/* Link to login */}
            <p className="flex justify-center mt-6 font-sans text-sm antialiased font-light leading-normal text-inherit">
                Already have an account?
                <button
                    onClick={toggleForm}
                    className="block ml-1 font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900"
                >
                    Sign in
                </button>
            </p>
        </div>
    );
};

export default SignUpForm;
