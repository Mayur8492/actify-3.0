const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/actify').then(async () => {
  const db = mongoose.connection.db;
  await db.collection('users').updateOne({ email: 'admin@actify.com' }, { $set: { role: 'admin' } });
  console.log('Fixed role to admin');
  process.exit(0);
});
