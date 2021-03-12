const bcrypt = require('bcryptjs');
const helpers = {}; //Object with multiple methods

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);  //create a patron
    return await bcrypt.hash(password, salt);  //after, the pass and patron will be encrypted
};

helpers.matchPassword = async (password, savedPassword) => {
    try {
        const result = await bcrypt.compare(password, savedPassword);
        return result;
    } 
    catch (error) { console.log(error); }
};

module.exports = helpers;