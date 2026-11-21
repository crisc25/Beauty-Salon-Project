
const statisticsModel = require("../models/statistics.model");

const getRevenue = async (data_start, data_end) => {
    if (!data_start || !data_end) {
        const error = new Error("Data de început și data de sfârșit sunt obligatorii");
        error.statusCode = 400;
        throw error;
    }

    const startDate = new Date(data_start);
    const endDate = new Date(data_end);

    if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime()) ||
        startDate.toISOString().slice(0, 10) !== data_start ||
        endDate.toISOString().slice(0, 10) !== data_end
    ) {
        const error = new Error("Datele trebuie să fie în formatul YYYY-MM-DD");
        error.statusCode = 400;
        throw error;
    }

    if (data_start > data_end) {
        const error = new Error("Data de început nu poate fi mai mare decât data de sfârșit");
        error.statusCode = 400;
        throw error;
    }

    return await statisticsModel.getRevenue(data_start, data_end);
};

module.exports = {
    getRevenue
};
