import bcrypt from 'bcryptjs';

const hashInDb = '$2b$10$ZrH3G5K8vLp2Qx1Yj0WnOeE4Bf5mJkLmN9Xa3TdRv6Uc7Ws1Yh2K';

async function run() {
  try {
    const isMatch = await bcrypt.compare('password123', hashInDb);
    console.log('Does password123 match seeded hash?', isMatch);
  } catch (err) {
    console.log('Hash in DB is placeholder or invalid bcrypt:', err.message);
  }

  const validHash = await bcrypt.hash('password123', 10);
  console.log('Real valid bcrypt hash for "password123":', validHash);
}

run();
