import { ContainerBuilder } from "~/container-builder";

export interface Types {
  a: number;
  b: string;
  c: boolean;
}

export const containerBuilder = new ContainerBuilder<Types>();

async function main() {
  const container = await containerBuilder.buildContainer(async (c) => {
    c.set("a", async () => 1);
    c.set("b", async () => "hello");
    c.set("c", async () => true);
    return c;
  });

  const service_a = await container.get("a"); // service_a is a number
  const service_b = await container.get("b"); // service_b is a string
  const service_c = await container.get("c"); // service_c is a boolean
}

main();
