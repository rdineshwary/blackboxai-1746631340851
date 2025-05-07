'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('password123', 10);
    const students = [];

    for (let i = 1; i <= 30; i++) {
      students.push({
        studentId: `S${1000 + i}`,
        studentName: `Student ${i}`,
        email: `student${i}@example.com`,
        passwordHash: passwordHash,
        role: 'member',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('users', students, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
