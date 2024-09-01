import { ContainerBuilder } from "~/container-builder";

class ServiceA {}

class ServiceB {
  constructor(private a: ServiceA) {}
}

export interface Types {
  a: ServiceA;
  b: ServiceB;
}

export const containerBuilder = new ContainerBuilder<Types>();

async function main() {
  const container = await containerBuilder.buildContainer(async (c) => {
    c.set("a", async () => new ServiceA());
    // ServiceB depends on ServiceA so we need to pass it as an argument. But we can't pass it directly because it is not yet created,
    // so we resolve it adding the container.get("a") as an argument to the ServiceB constructor that will be called when the ServiceB is created.
    // creating a new instance of ServiceB with the resolved ServiceA as an argument.
    c.set("b", async (c) => new ServiceB(await c.get("a")));
    return c;
  });

  const service_a = await container.get("a"); // service_a is a ServiceA instance
  const service_b = await container.get("b"); // service_b is a ServiceB instance that depends on the same ServiceA instance created before
}

main();
