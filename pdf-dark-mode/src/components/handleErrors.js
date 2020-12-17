//For handling fetch api response errors

const handleErrors = (res) => {
    return new Promise((resolve, reject) => {
    if (!res.ok) {
        console.log(res.text())
        reject(new Error(res.statusText));
    } else {
        resolve(res);
    }
    });
}

export default handleErrors;