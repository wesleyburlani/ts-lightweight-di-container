/**
 * function that declares how to initialize a service when it is requested
 */
export type InitFunc<T> = (container: Container<T>) => Promise<T[keyof T]>;

/**
 * function that declares how to dispose a service when it is no longer needed
 */
export type DisposeFunc<TServices, T extends keyof TServices> = (service: TServices[T]) => Promise<void>;

/**
 * Configuration object that allows to specify which services are needed
 * in a projection
 */
export type ProjectionConfig<TServices> = {
  [P in keyof TServices]?: boolean;
};

/**
 * Type that represents a projection of services with only the ones that are needed
 * in a given context. It is a subset of the original services object. If a service
 * is not needed, it is replaced by `undefined`.
 * @example
 * ```ts
 * interface Services {
 *  a: number;
 *  b: string;
 *  c: boolean;
 * }
 * type Projection = Projection<Services, { a: true, c: true }>;
 * // Projection is { a: number, b: undefined, c: boolean  }
 * ```
 */
export type Projection<TServices, C extends ProjectionConfig<TServices>> = {
  [P in keyof TServices]: C[P] extends true ? TServices[P] : undefined;
};

/**
 * Lightweight DI Container that allows to declare services and get them
 * with their dependencies resolved. It also allows to get a projection of
 * services with only the ones that are needed.
 */
export class Container<TServices> {
  private readonly initFuncs: Map<keyof TServices, InitFunc<TServices>> = new Map();
  private readonly disposeFuncs: Map<keyof TServices, DisposeFunc<TServices, keyof TServices>> = new Map();
  private readonly services: Map<keyof TServices, TServices[keyof TServices]> = new Map();

  /**
   * Declares a service in the container
   * @param name Service name
   * @param initFunc Function that initializes the service
   * @param disposeFunc Function that disposes the service when it is no longer needed
   */
  public set<S extends keyof TServices>(
    name: S,
    initFunc: InitFunc<TServices>,
    disposeFunc: DisposeFunc<TServices, S> = async () => {
      return;
    },
  ) {
    this.initFuncs.set(name, initFunc);
    this.disposeFuncs.set(name, disposeFunc as DisposeFunc<TServices, keyof TServices>);
  }

  /**
   * Gets a service from the container. If the service has not been initialized
   * yet, it will be initialized using the init function declared with `set`.
   * @param name Service name
   * @returns The service instance
   * @throws If the service is not declared in the container
   */
  public async get<S extends keyof TServices>(name: S): Promise<TServices[S]> {
    const service = this.services.get(name);
    if (!service) {
      const initFunc = this.initFuncs.get(name);
      if (!initFunc) {
        throw new Error(`Service ${String(name)} not declared on this container`);
      }
      const service = await initFunc(this);
      this.services.set(name, service);
    }
    return this.services.get(name) as TServices[S];
  }

  /**
   * Gets a projection of services from the container. The projection is a subset
   * of the original services object with only the services that are needed.
   * @example
   * ```ts
   * interface Services {
   *  a: number;
   *  b: string;
   *  c: boolean;
   * }
   *
   * const container = new Container<Services>();
   * container.set('a', async () => 1);
   * container.set('b', async () => 'hello');
   * container.set('c', async () => true);
   * const projection = await container.getProjection({ a: true, c: true });
   * // projection is { a: 1, b: undefined, c: true }
   * ```
   * @param config Configuration object that specifies which services are needed
   * @returns A projection of services
   */
  public async getProjection<C extends ProjectionConfig<TServices>>(config: C): Promise<Projection<TServices, C>> {
    const services = {} as Projection<TServices, ProjectionConfig<TServices>>;
    for (const key in config) {
      if (config[key]) {
        const k = key as unknown as keyof TServices;
        services[k] = (await this.get(k)) as any;
      }
    }
    return services;
  }

  /**
   * Disposes all services in the container. It will call the dispose function
   * declared with `set` for each service. If the dispose function is not declared,
   * it will do nothing.
   * @returns A promise that resolves when all services have been disposed
   */
  public async dispose() {
    const promises = [];
    for (const [key, service] of this.services.entries()) {
      const disposeFunc = this.disposeFuncs.get(key);
      if (disposeFunc) {
        promises.push(disposeFunc(service));
      }
    }
    await Promise.all(promises);
    this.services.clear();
  }
}
