
const statisticsService = require("../services/statistics.service");

const getRevenue = async (req, res) => {
    const { data_start, data_end } = req.query;

    const result = await statisticsService.getRevenue(data_start, data_end);

    res.json(result);
};

module.exports = {
    getRevenue
};
