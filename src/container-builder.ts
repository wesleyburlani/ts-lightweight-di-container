import { Container, ProjectionConfig } from "./container";

export type BuildContainerFn<T> = (container: Container<T>) => Promise<Container<T>>;

/**
 * Builder class that allows to build a container with a given configuration
 * @example
 *
 * ```ts
 * import { ContainerBuilder } from "./container-builder";
 *
 * interface Types {
 *  a: number;
 *  b: string;
 *  c: boolean;
 * }
 *
 * const containerProjection = containerBuilder.buildProjectionConfig({
 *  a: true,
 *  c: true,
 * });
 *
 * type Services = Projection<Types, typeof containerProjection>;
 * // Services is { a: number, b: undefined, c: boolean }
 *
 * const containerBuilder = new ContainerBuilder<Types>();
 * const container = await containerBuilder.buildContainer(async (c) => {
 *  c.set("a", async () => 1);
 *  c.set("b", async () => "hello");
 *  c.set("c", async () => true);
 *  return c;
 *});
 *
 * const services = await container.getProjection(containerProjection);
 * // services.a is a number
 * // services.b is undefined
 * // services.c is a boolean
 * ```
 *
 */
export class ContainerBuilder<T> {
    /**
     * Builds a container configuration object that specifies which services are needed
     * @param config Configuration object that specifies which services are needed
     * @returns The configuration object
     * @example
     *
     * ```ts
     * const containerProjection = containerBuilder.buildProjectionConfig({
     *  a: true,
     *  c: true,
     * });
     * // containerProjection is { a: true, b: false, c: true }
     */
    buildProjectionConfig<C extends ProjectionConfig<T>>(config: C): C {
        return config as C;
    }

    /**
     * Builds a container with the given configuration function
     * @param fn Configuration function that sets up the container
     * @returns The container instance
     * @example
     * ```ts
     * const container = await containerBuilder.buildContainer(async (c) => {
     *  c.set("a", async () => 1);
     *  c.set("b", async () => "hello");
     *  c.set("c", async () => true);
     *  return c;
     * });
     * ```
     */
    async buildContainer(fn: BuildContainerFn<T>): Promise<Container<T>> {
        const container = new Container<T>();
        return await fn(container);
    }
}
