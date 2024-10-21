const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");
const seed = async (numUsers = 5, numProfessors = 10, numDepartments = 2) => {
  // TODO:
  const users = Array.from({ length: numUsers }, () => ({
    username: faker.internet.userName(),
    password: faker.internet.password(),
  }));
  await prisma.user.createMany({ data: users });

  const departments = Array.from({ length: numDepartments }, () => ({
    name: faker.company.buzzAdjective() + " " + faker.company.buzzNoun(),
    description: faker.lorem.sentence(),
    image: faker.image.url(),
    departmentEmail: faker.internet.email(),
    departmentPhone: faker.phone.number(),
  }));
  await prisma.department.createMany({ data: departments });

  const professors = Array.from({ length: numProfessors }, () => ({
    name: faker.person.fullName(),
    bio: faker.lorem.sentences(),
    profileImage: faker.image.url(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    departmentId: 1,
  }));
  await prisma.professor.createMany({ data: professors });
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
