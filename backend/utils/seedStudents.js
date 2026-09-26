const { User, Group, GroupMember } = require('../models');

async function seedStudents() {
  try {
    const sampleStudents = [
      { name: 'Jasur Bekmirov', email: 'jasur@tuit.uz' },
      { name: 'Malika Sobirova', email: 'malika@tuit.uz' },
      { name: 'Azizjon Yoqubov', email: 'azizjon@tuit.uz' },
      { name: 'Diyora Olimova', email: 'diyora@tuit.uz' },
      { name: 'Sardor Qodirov', email: 'sardor@tuit.uz' },
    ];

    const groups = await Group.findAll();
    for (const s of sampleStudents) {
      let student = await User.findOne({ where: { email: s.email } });
      if (!student) {
        student = await User.create({
          name: s.name,
          email: s.email,
          password: 'password123',
          role: 'STUDENT',
          approval_status: 'APPROVED',
        });
      }

      for (const g of groups) {
        await GroupMember.findOrCreate({
          where: { group_id: g.id, student_id: student.id },
          defaults: { group_id: g.id, student_id: student.id }
        });
      }
    }

    console.log('Successfully seeded student members for all groups! ✅');
  } catch (err) {
    console.error('Seed students error:', err.message);
  }
}

seedStudents().then(() => process.exit(0));
