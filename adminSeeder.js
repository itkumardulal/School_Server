const bcrypt = require("bcrypt");
const { seederConfig } = require("./src/config/config");
const { admins } = require("./src/database/connection");

const adminSeeder = async (req, res) => {

    const [data] = await admins.findAll({
      where: { email: seederConfig.email },
    });

    if (!data) {
      await admins.create({
        email: seederConfig.email,
        password: bcrypt.hashSync(seederConfig.password, 12),
        role: seederConfig.role
      });
      console.log("Data seeded successfully");
    } else {
      console.log("Data already exists, skipping seeding");
    }
  }

module.exports = adminSeeder;
