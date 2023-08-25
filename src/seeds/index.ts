import * as bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';
import * as dotenv from 'dotenv';

dotenv.config();

(async () => {
  const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    models: [User],
  });

  // Initialize models with the Sequelize instance
  sequelize.addModels([User]);

  await sequelize.sync({ force: true }); // This will drop the existing tables and re-create them

  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await User.bulkCreate([
      {
        username: 'user1',
        password: hashedPassword,
        nickname: 'User One',
      },
      {
        username: 'user2',
        password: hashedPassword,
        nickname: 'User Two',
      },
      {
        username: 'Sméagol',
        password: hashedPassword,
        nickname: 'Sméagol',
      },
    ]);

    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close();
  }
})();
