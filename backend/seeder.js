const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Case = require('./models/Case');
const bcrypt = require('bcryptjs');

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany();
  await Case.deleteMany();

  const admin = new User({ username: 'admin', password: await bcrypt.hash('admin123',10), role: 'admin' });
  const user = new User({ username: 'demo', password: await bcrypt.hash('demo123',10), role: 'user' });
  await admin.save(); await user.save();

  const cases = [
    { user: user._id, symptoms: ['Fever','Cough'], predictedDisease: 'Flu', notes: 'Demo case' },
    { user: user._id, symptoms: ['Headache','Nausea','Light sensitivity'], predictedDisease: 'Migraine' }
  ];
  await Case.insertMany(cases);
  console.log('Seeded admin and demo user (admin/admin123, demo/demo123)');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
