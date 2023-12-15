import React, {useState, useEffect} from "react";
import axios from "axios";
import {UserPlusIcon} from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    Tooltip,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Textarea, Alert, Select, Option
} from "@material-tailwind/react";
import {jwtDecode} from "jwt-decode";
import toast from "react-hot-toast";

const TABLE_HEAD = ["Patient ID", "Full Name", "Gender", "Blood Type", "Type of Sicknes", "Extra Notes", "Phone", "Admin", "Edit"];

export function Dashboard() {

    const [patients, setPatients] = useState([]);
    const [allAdmins, setAllAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState('');
    // PAGINATION STATE
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState("");
    const [totalPatients, setTotalPatients] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);

    // FOR ADDING NEW PATIENT MODAL
    const [openNewPatient, setOpenNewPatient] = useState(false);
    const handleOpenNewPatient = () => setOpenNewPatient(!openNewPatient);

    const [openEditPatient, setOpenEditPatient] = useState(false);
    const [allOccupations, setAllOccupations] = useState([]);

    const [patientFormData, setPatientFormData] = useState({
        name: "",
        surname: "",
        idNumber: "",
        gender: "",
        blood_type: "",
        typeofsickness: "",
        phone: "",
        extra_notes: "",
    });

    // get body from session storage
    const body = JSON.parse(localStorage.getItem("body"));
    const token = jwtDecode(body.token);
    const adminFromToken = token.name + " " + token.surname;
    const adminToken = body.token

    const getAdmins = async () => {
        try {
            // Make an Axios GET request to the occupations endpoint
            const response = await axios.get('http://localhost:5000/admins');

            // Extract the data from the response
            const adminsData = response.data;

            // Set the occupations in the state
            setAllAdmins(adminsData);

        } catch (error) {
            // Handle errors, log them to the console, or display an error message
            console.error('Error fetching occupations:', error);
        }
    }


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


    // Function to add a new patient
    const handleConfirmAddPatient = () => {

        // Prepare the patient data from the form
        const patientData = {
            name: patientFormData.name,
            surname: patientFormData.surname,
            idNumber: patientFormData.idNumber,
            gender: patientFormData.gender,
            blood_type: patientFormData.blood_type,
            typeofsickness: patientFormData.typeofsickness,
            extra_notes: patientFormData.extra_notes ? patientFormData.extra_notes : "No extra notes",
            phone: patientFormData.phone,
        };


        axios.post('http://localhost:5000/add-patient', patientData, {
            headers: {
                'Authorization': adminToken,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log('Patient added successfully:', response.data);
                // Clear the form
                setPatientFormData({
                    name: "",
                    surname: "",
                    idNumber: "",
                    gender: "",
                    blood_type: "",
                    typeofsickness: "",
                    extra_notes: "",
                    phone: "",
                });

                // Display success toast
                toast.success('Patient added successfully');

                // Close the dialog
                handleOpenNewPatient();
            })
            .catch(error => {
                console.error('Error adding patient:', error.response.data);
                toast.error(error.response.data.message ? error.response.data.message : 'An error occurred');
                // Handle error, if needed
            });
    }

    const handleConfirmEditPatient = () => {
        // Prepare the updated patient data from the form
        const updatedPatientData = {
            name: selectedPatient.name,
            surname: selectedPatient.surname,
            idNumber: selectedPatient.idNumber,
            gender: selectedPatient.gender,
            blood_type: selectedPatient.blood_type,
            typeofsickness: selectedPatient.typeofsickness,
            extra_notes: selectedPatient.extra_notes,
            phone: selectedPatient.phone,
            adminID: selectedAdmin ? selectedAdmin.id : selectedPatient.admin[0].adminID,
        };
        console.log( "updatedPatientdata "+updatedPatientData)
        console.log("selectedadmin" + selectedAdmin)
        // Make an Axios PUT request to update the patient
        axios.put(`http://localhost:5000/update-patient/${selectedPatient?.patient_id}`, updatedPatientData, {
            headers: {
                Authorization: adminToken,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log('Patient updated successfully:', response.data);
                // Close the edit patient modal
                setOpenEditPatient(false);
                // Display success toast or perform other actions as needed
                toast.success('Patient updated successfully');
            })
            .catch(error => {
                console.error('Error updating patient:', error.response.data);
                // Handle error, if needed
                toast.error(error.response.data.message ? error.response.data.message : 'An error occurred');
            });
    };


    // Function to retrieve all patients
    const getAllPatients = async () => {
        try {

            const response = await axios.get(
                `http://localhost:5000/view-all-patients?page=${page}&pageSize=5`,
                {
                    headers: {
                        Authorization: adminToken,
                    },
                }
            );

            // Handle the response as needed
            if (response.status === 200) {
                setPatients(response.data.patients);
                setTotalPages(response.data.totalPages);
                setTotalPatients(response.data.total_patients);

            } else {
                console.log("Error retrieving patients:", response.data);
                // Handle the error or show a notification
            }
        } catch (error) {
            console.error("Error during patient retrieval:", error.message);
        }
    };
    // Function to handle "Previous" button click
    const handlePreviousPage = () => {
        setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
    };

    // Function to handle "Next" button click
    const handleNextPage = () => {
        setPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
    };

    // Fetch data when page state changes
    useEffect(() => {
        getAllPatients();
        fetchOccupations();
        getAdmins();
    }, [page]); // Only run when the page state changes


    // Function to handle form input changes
    const handleInputChange = (e, fieldName) => {
        const {name, value} = e.target;
        setPatientFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setSelectedPatient(prevPatient => ({
            ...prevPatient,
            [fieldName]: value,
        }));
    };

    // search patient function
    const searchPatient = async (searchText) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/search-patient',
                {
                    searchText,
                    page: 1, // Set the default page to 1 or adjust as needed
                    pageSize: 5, // Set the default page size or adjust as needed
                },
                {
                    headers: {
                        Authorization: adminToken,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Handle the response as needed
            if (response.status === 200) {
                setPatients(response.data.patients);
                setTotalPages(response.data.totalPages);
                setTotalPatients(response.data.total_patients);
            } else {
                console.log('Error retrieving patients:', response.data);
                // Handle the error or show a notification
            }
        } catch (error) {
            console.error('Error during patient retrieval:', error.message);
        }
    };


    function Icon() {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
            </svg>

        );
    }


    const handleSelectChange = (fieldName, value) => {
        if (fieldName === 'admin') {
            setSelectedAdmin(value);
        } else {
            setPatientFormData((prevData) => ({
                ...prevData,
                [fieldName]: value,
            }));
        }
    };
    const handleDeletePatient = () => {
        // Make an Axios DELETE request to delete the patient
        axios.delete(`http://localhost:5000/delete-patient/${selectedPatient?.patient_id}`, {
            headers: {
                Authorization: adminToken,
            },
        })
            .then(response => {
                setOpenEditPatient(false);
                toast.success('Patient deleted successfully');
                getAllPatients();
            })
            .catch(error => {
                console.error('Error deleting patient:', error.response.data);
                toast.error(error.response.data.message ? error.response.data.message : 'An error occurred');
            });
    };


    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Patients List
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            See information about all members
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <div className="searchArea">
                            <div className="container">
                                {/*Inside your input element*/}
                                <input
                                    className="inputSearch"
                                    type="text"
                                    placeholder="Search..."
                                    onChange={(e) => searchPatient(e.target.value)}
                                />
                                <div className="search"></div>
                            </div>
                        </div>
                        <Button className="flex items-center gap-3" size="sm" onClick={handleOpenNewPatient}
                                variant="gradient">
                            <UserPlusIcon strokeWidth={2} className="h-4 w-4"/> Add Patient
                        </Button>
                        <Dialog open={openNewPatient} handler={handleOpenNewPatient}>
                            <DialogHeader>Create New Pateient</DialogHeader>
                            <DialogBody>
                                <div className="flex flex-col gap-4">
                                    <Typography color="gray" className="mt-1 font-normal">
                                        Please fill in the information below
                                    </Typography>

                                    <div className="flex flex-row gap-4">
                                        <Input
                                            variant="outlined"
                                            label="Patient Name"
                                            name="name"
                                            value={patientFormData?.name}
                                            onChange={handleInputChange}
                                        />
                                        <Input
                                            variant="outlined"
                                            label="Patient Surname"
                                            name="surname"
                                            value={patientFormData?.surname}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="flex flex-row gap-4">
                                        <Input
                                            variant="outlined"
                                            label="Patient ID Number"
                                            name="idNumber"
                                            value={patientFormData?.idNumber}
                                            onChange={handleInputChange}
                                        />
                                        <Select
                                            variant="outlined"
                                            label="Gender"
                                            name="gender"
                                            value={patientFormData?.gender}
                                            onChange={(value) => handleSelectChange('gender', value)}
                                        >
                                            <Option value="male">Male</Option>
                                            <Option value="female">Female</Option>
                                        </Select>

                                    </div>

                                    <div className="flex flex-row gap-4">
                                        <Select
                                            variant="outlined"
                                            label="Blood Type"
                                            name="blood_type"
                                            value={patientFormData?.blood_type}
                                            onChange={(value) => handleSelectChange('blood_type', value)}
                                        >
                                            <Option value="A+">A+</Option>
                                            <Option value="A-">A-</Option>
                                            <Option value="B+">B+</Option>
                                            <Option value="B-">B-</Option>
                                            <Option value="AB+">AB+</Option>
                                            <Option value="AB-">AB-</Option>
                                            <Option value="O+">O+</Option>
                                            <Option value="O-">O-</Option>
                                        </Select>
                                        <Input
                                            variant="outlined"
                                            label="Phone"
                                            name="phone"
                                            value={patientFormData?.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="flex flex-row gap-4">
                                        <Input
                                            variant="outlined"
                                            label="Type of Sickness"
                                            name="typeofsickness"
                                            value={patientFormData?.typeofsickness}
                                            onChange={handleInputChange}
                                        />
                                        <Input
                                            variant="outlined"
                                            label={adminFromToken}
                                            disabled={true}
                                        />

                                    </div>

                                    <Textarea
                                        variant="outlined"
                                        label="Extra Notes About Patient..."
                                        name="extra_notes"
                                        value={patientFormData?.extra_notes}
                                        onChange={handleInputChange}
                                    />

                                </div>
                            </DialogBody>
                            <DialogFooter>
                                <Button
                                    variant="text"
                                    color="red"
                                    onClick={handleOpenNewPatient}
                                    className="mr-1"
                                >
                                    <span>Cancel</span>
                                </Button>
                                <Button variant="gradient" color="green" onClick={handleConfirmAddPatient}>
                                    <span>Confirm</span>
                                </Button>
                            </DialogFooter>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                    <tr>
                        {TABLE_HEAD.map((head) => (
                            <th
                                key={head}
                                className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal leading-none opacity-70"
                                >
                                    {head}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    {
                        patients.length === 0 ? (
                                <tbody className="relative w-full h-[50vh]">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <Alert
                                        color={"#de2449"}
                                        icon={
                                            <div className="w-5 h-full flex items-center justify-center">
                                                <Icon/>
                                            </div>
                                        }
                                    >
                                        <p className="font-bold text-center">No patients found</p>
                                        <p className="text-sm text-center">Please enter valid patient information...</p>
                                    </Alert>
                                </div>

                                </tbody>


                            )
                            :
                            patients.map(
                                (item, index) => {
                                    const isLast = index === patients.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                                    console.log(item)
                                    return (
                                        <tbody>
                                        <tr key={index}>
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col ">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item?.patient_id}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {item?.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal opacity-70"
                                                    >
                                                        {item?.surname}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col ">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item?.gender}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col ">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item?.blood_type}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col ">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item?.typeofsickness}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col ">
                                                        <Tooltip content={item?.extra_notes}
                                                                 animate={{
                                                                     mount: {scale: 1, y: 0},
                                                                     unmount: {scale: 0, y: 25},
                                                                 }}>
                                                            <Button>extra notes</Button>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col ">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item?.phone}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col ">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {item?.admin[0]?.name + " " + item?.admin[0]?.surname}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col bg-none">
                                                        <Button
                                                            className="flex items-center gap-3"
                                                            size="sm"
                                                            onClick={() => {
                                                                setOpenEditPatient(true);
                                                                setSelectedPatient(item);
                                                            }}
                                                            variant="gradient"
                                                        >
                                                            Edit Patient
                                                        </Button>
                                                        <Dialog open={openEditPatient}
                                                                onClose={() => setOpenEditPatient(false)}>
                                                            <DialogHeader>Edit Patient</DialogHeader>
                                                            <DialogBody>
                                                                <div className="flex flex-col gap-4">
                                                                    <Typography color="gray"
                                                                                className="mt-1 font-normal">
                                                                        Please fill in the information below
                                                                    </Typography>
                                                                    {/* Display the selected patient's information in the form */}
                                                                    <div className="flex flex-row gap-4">
                                                                        <Input
                                                                            label="Patient Name"
                                                                            name="name"
                                                                            value={selectedPatient?.name || ''}
                                                                            onChange={(e) => handleInputChange(e, 'name')}
                                                                        />
                                                                        <Input
                                                                            label="Patient Surname"
                                                                            name="surname"
                                                                            value={selectedPatient?.surname || ''}
                                                                            onChange={(e) => handleInputChange(e, 'surname')}
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-row gap-4">
                                                                        <Input
                                                                            label="Patient ID Number"
                                                                            name="idNumber"
                                                                            value={selectedPatient?.idNumber || ''}
                                                                            onChange={(e) => handleInputChange(e, 'idNumber')}
                                                                        />
                                                                        <Input
                                                                            label="Phone"
                                                                            name="phone"
                                                                            value={selectedPatient?.phone || ''}
                                                                            onChange={(e) => handleInputChange(e, 'phone')}
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-row gap-4">
                                                                        <Input
                                                                            label="Type of Sickness"
                                                                            name="typeofsickness"
                                                                            value={selectedPatient?.typeofsickness || ''}
                                                                            onChange={(e) => handleInputChange(e, 'typeofsickness')}
                                                                        />

                                                                        <Select
                                                                            label="Admin"
                                                                            name="admin"
                                                                            value={selectedAdmin}
                                                                            onChange={(value) => handleSelectChange('admin', value)}
                                                                        >
                                                                            {allAdmins.map((admin) => (
                                                                                <Option key={admin.id}
                                                                                        value={admin.name + " " + admin.surname}>{admin.name + " " + admin.surname}</Option>
                                                                            ))}
                                                                        </Select>
                                                                    </div>
                                                                    <Textarea
                                                                        label="Extra Notes About Patient..."
                                                                        name="extra_notes"
                                                                        value={selectedPatient?.extra_notes || ''}
                                                                        onChange={(e) => handleInputChange(e, 'extra_notes')}
                                                                    />
                                                                </div>
                                                            </DialogBody>
                                                            <DialogFooter>
                                                                <div className="flex justify-between w-full">
                                                                    <Button
                                                                        variant="text"
                                                                        color="red"
                                                                        onClick={() => setOpenEditPatient(false)}
                                                                        className="mr-1"
                                                                    >
                                                                        <span>Cancel</span>
                                                                    </Button>
                                                                    <div>
                                                                        <Button
                                                                            variant="text"
                                                                            color="red"
                                                                            onClick={handleDeletePatient}
                                                                            className="mr-1"
                                                                        >
                                                                            <span>Delete</span>
                                                                        </Button>
                                                                        <Button
                                                                            variant="gradient"
                                                                            color="green"
                                                                            onClick={handleConfirmEditPatient}
                                                                        >
                                                                            <span>Confirm</span>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </DialogFooter>
                                                        </Dialog>

                                                    </div>
                                                </div>

                                            </td>
                                        </tr>
                                        </tbody>
                                    );
                                }
                            )

                    }
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Page {page} of {totalPages}
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm" onClick={handlePreviousPage}>
                        Previous
                    </Button>
                    <Button variant="outlined" size="sm" onClick={handleNextPage}>
                        Next
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
        ;
}