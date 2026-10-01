const express = require("express");

const {
    getServices,
    getServiceById,
    createService,
    updateService,
    patchService,
     deleteService
} = require("../controllers/service.controller");

const router = express.Router();

router.get("/", getServices);
router.get("/:id", getServiceById);
router.post("/", createService);
router.put("/:id", updateService);
router.patch("/:id", patchService);
router.delete("/:id", deleteService);



module.exports = router;