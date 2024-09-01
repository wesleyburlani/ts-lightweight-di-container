import { Projection } from "~/container";
import { ContainerBuilder } from "~/container-builder";

export interface Types {
  a: number;
  b: string;
  c: boolean;
}

export const containerBuilder = new ContainerBuilder<Types>();

const projectionConfig = containerBuilder.buildProjectionConfig({
  a: true,
  c: true,
});

type ProjectionType = Projection<Types, typeof projectionConfig>;
/// ProjectionType is { a: number, b: undefined, c: boolean }

async function main() {
  const container = await containerBuilder.buildContainer(async (c) => {
    c.set("a", async () => 1);
    c.set("b", async () => "hello");
    c.set("c", async () => true);
    return c;
  });

  const projection: ProjectionType = await container.getProjection(projectionConfig);
  console.log(projection);
  // projection.a is a number
  // projection.b is undefined
  // projection.c is a boolean
}

main();
