import { Projection } from "./container";
import { ContainerBuilder } from "./container-builder";

export interface Types {
  a: number;
  b: string;
  c: boolean;
}

export const containerBuilder = new ContainerBuilder<Types>();

const containerProjection = containerBuilder.buildContainerConfig({
  a: true,
  c: true,
});

type Services = Projection<Types, typeof containerProjection>;

async function main() {
  const container = await containerBuilder.buildContainer(async (c) => {
    c.set("a", async () => 1);
    c.set("b", async () => "hello");
    c.set("c", async () => true);
    return c;
  });
  
  const g = await container.getProjection(containerProjection);
}

main();