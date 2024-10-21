//Import express, create router, import authenticate and prisma
const express = require("express");
const router = express.Router();
const { authenticate } = require("./auth");
const prisma = require("../prisma");

//Create get route to get all departments, catch errors and pass to next error handler

/**
 * @route GET /
 * @group departments
 * @returns {Array<Object>} get all departments
 * @throws {Error} if error
 */

router.get("/", async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (e) {
    next(e);
  }
});

//Create a get route to get the department with a specific id
/**
 * @route GET /:id
 * @group departments
 * @param {String} id
 * @returns {Object} department
 * @throws {Error} if issue getting that department
 */

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const department = await prisma.department.findUniqueOrThrow({
      where: { id: +id },
      include: { professors: true },
    });
    res.json(department);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
