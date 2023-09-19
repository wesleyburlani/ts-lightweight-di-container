import { Container } from 'typedi';
import { Service } from '~/services/service';
import { Test } from '~/services/test';

export function buildContainer() {
    Container.set(Test, new Test);
    Container.set(Service, new Service(Container.get(Test)));    
} 