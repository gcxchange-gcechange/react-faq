
/* eslint-disable @typescript-eslint/no-explicit-any */

import {IFaqProp} from './IFaqProp';
export interface IFaqServices {
    getFaq:(listName: any) => Promise<IFaqProp[]>;
}
