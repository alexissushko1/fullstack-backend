const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");
const seed = async () => {
  // TODO:
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
