import {IFaqProp} from './IFaqProp';
export interface IFaqServices {
    getFaq:(listName, url) => Promise<IFaqProp[]>;
}
