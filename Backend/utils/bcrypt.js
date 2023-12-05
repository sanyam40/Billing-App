const bcrypt = require('bcrypt');

const encryptPassword = {

    hasPwd(originalPwd) {
        const hashedPws = bcrypt.hashSync(originalPwd, 10);
        return hashedPws;
},
matchPwd(originalPwd, hashedPwd) {
    const matchedOrNot = bcrypt.compareSync(originalPwd, hashedPwd);
    return matchedOrNot;
}
}

module.exports = encryptPassword;