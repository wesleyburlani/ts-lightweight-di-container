import { buildContainer } from "./di/container";
import { createServer } from "./ports/http/server";

async function main() {
    const port = 3000;
    buildContainer();
    const server = await createServer();
    server.listen(port, () => console.log(`server up and running on port ${port}`));
}

main();