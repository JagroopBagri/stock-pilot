import { updateStocks } from "../src/app/api/v1/crons/update-stocks/route.js";

   async function run() {
     console.log('Starting stock update...');
     const result = await updateStocks();
     console.log(result.message);
   }

   run().catch(console.error);