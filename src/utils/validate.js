const isAllowedUSerFields = ['firstName', 'lastName', 'age', 'gender', 'skills', 'about', 'profileUrl'];

const validateEditProfileData = (data) => {
    return Object.keys(data).every(key => isAllowedUSerFields.includes(key));
}

module.exports = {
    validateEditProfileData
};
