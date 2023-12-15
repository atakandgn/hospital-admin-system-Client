// authUtils.js

export const getAuthToken = () => {
    const storedData = sessionStorage.getItem('body');

    if (storedData) {
        const parsedData = JSON.parse(storedData);

        // Assuming your token is stored in the 'token' property of the data
        return parsedData.token;
    }

    return null; // Return null or handle the case when the token is not found
};
