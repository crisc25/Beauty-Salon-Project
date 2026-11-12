
const adminService = require("../services/admin.service");

const login = async (req, res) => {
    const { username, password } = req.body;

    const result = await adminService.login(username, password);

    res.status(200).json(result);
};

module.exports = {
    login
};
