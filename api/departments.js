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

//Create a post route, so when logged in, can add a department
/**
 * @route POST /
 * @group departments
 * @security JWT
 * @param {Object} department body
 * @param {String} name
 * @param {String} description
 * @param {String} image
 * @param {String} departmentEmail
 * @param {String} departmentPhone
 * @param {Array<number>} array of professor Ids
 * @return {Object} department
 * @throws {Error} if issue creating department
 */

router.post("/", authenticate, async (req, res, next) => {
  const {
    name,
    description,
    image,
    departmentEmail,
    departmentPhone,
    professorIds,
  } = req.body;
  try {
    const professors = professorIds.map((id) => ({ id }));
    const department = await prisma.department.create({
      data: {
        name,
        description,
        image,
        departmentEmail,
        departmentPhone,
        professors: { connect: professors },
      },
    });
    res.status(201).json(department);
  } catch (e) {
    next(e);
  }
});

//Create a put route so, when logged in, can change the name, description, or banner image of an existing department
/**
 * @route PUT
 * @group departments
 * @security JWT
 * @param {String} id
 * @param {String} name
 * @param {String} description
 * @param {String} image
 * @returns {Object} updatedDepartment
 * @throws {Error} error if issue updating department
 */

router.put("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { name, description, image } = req.body;
  console.debug(req.params, req.body);

  try {
    // Check if the department exists
    const department = await prisma.department.findUnique({
      where: { id: +id },
    });
    if (!department) {
      return next({
        status: 404,
        message: `Department ${id} does not exist`,
      });
    }

    console.log("Request Body:", req.body);
    // Construct update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (image) updateData.image = image;
    console.log(updateData);
    // Check if there is data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    // Update the department
    const updatedDepartment = await prisma.department.update({
      where: { id: +id },
      data: updateData,
    });

    console.log("Updated Department:", updatedDepartment);
    res.json(updatedDepartment);
  } catch (e) {
    next(e);
  }
});
//Create a delete route that, when logged in, deletes a department with a specific id
/**
 * @route DELETE /
 * @group departments
 * @security JWT
 * @param {String} id
 * @returns {Promise<void>} 204 if successful
 * @throws {Error} if issue deleting department
 */

router.delete("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const department = await prisma.department.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.department.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
