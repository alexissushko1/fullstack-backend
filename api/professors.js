const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

// GET/professors should send an array of all professors.
router.get("/", async (req, res, next) => {
  try {
    const professors = await prisma.professor.findMany();
    res.json(professors);
  } catch (e) {
    next(e);
  }
});

// GET/professors/:id should send a single professor according to given ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const professor = await prisma.professor.findUniqueOrThrow({
      where: { id: +id },
    });
    res.json(professor);
  } catch (e) {
    next(e);
  }
});

// POST/professors should add a new professor
router.post("/", async (req, res, next) => {
  const { name, bio, profileImage, email, phone } = req.body;

  // Check if name was provided
  if (!name) {
    return next({
      status: 400,
      message: "A new name must be provided.",
    });
  }

  // Check if bio was provided
  if (!bio) {
    return next({
      status: 400,
      message: "A new bio must be provided.",
    });
  }

  // Check if profileImage was provided
  if (!profileImage) {
    return next({
      status: 400,
      message: "A new profileImage must be provided.",
    });
  }

  // Check if email was provided
  if (!email) {
    return next({
      status: 400,
      message: "A new email must be provided.",
    });
  }

  // Check if phone was provided
  if (!phone) {
    return next({
      status: 400,
      message: "A new phone must be provided.",
    });
  }

  try {
    const professor = await prisma.professor.create({
      data: {
        name,
        bio,
        profileImage,
        email,
        phone,
        departmentId,
      },
    });
    res.status(201).json(professor);
  } catch (e) {
    next(e);
  }
});

// DELETE/professors/:id removes the specific professor, this can only be deleted by the logged-in user
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the professor exists
    const professor = await prisma.professor.findUnique({ where: { id: +id } });
    if (!professor) {
      return next({
        status: 404,
        message: `Professor with id ${id} does not exist.`,
      });
    }

    // Delete the professor
    await prisma.professor.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// PUT /professors/:id updates the specific professor
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, bio, profileImage, email, phone } = req.body;

  // Check if name was provided
  if (!name) {
    return next({
      status: 400,
      message: "A new name must be provided.",
    });
  }

  // Check if bio was provided
  if (!bio) {
    return next({
      status: 400,
      message: "A new bio must be provided.",
    });
  }

  // Check if profileImage was provided
  if (!profileImage) {
    return next({
      status: 400,
      message: "A new profileImage must be provided.",
    });
  }

  // Check if email was provided
  if (!email) {
    return next({
      status: 400,
      message: "A new email must be provided.",
    });
  }

  // Check if phone was provided
  if (!phone) {
    return next({
      status: 400,
      message: "A new phone must be provided.",
    });
  }

  try {
    // Check if the professor exists
    const professor = await prisma.professor.findUnique({ where: { id: +id } });
    if (!professor) {
      return next({
        status: 404,
        message: `Professor with id ${id} does not exist.`,
      });
    }

    // Update the professor
    const updatedProfessor = await prisma.professor.update({
      where: { id: +id },
      data: { name, email, bio, profileImage },
    });
    res.json(updatedProfessor);
  } catch (e) {
    next(e);
  }
});