import 'dotenv/config';
// import server from './configs/app.config';
import server from './configs/socket.config';
import initializeDatabase from './configs/database.config';
import env from './utils/validateEnv.util';
async function main() {
  try {
    await initializeDatabase();
    server.listen(env.PORT, () =>
      console.log(
        `⚡Server is running on port http://localhost:${env.PORT} ⚡`,
      ),
    );
  } catch (error) {
    console.log('Error when init: ', error);
  }
}

await main();
