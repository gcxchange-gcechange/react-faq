import { ServiceScope } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IReactFaqProps {
  listName: string;
  ServiceScope: ServiceScope;
  prefLang: string;
  context: WebPartContext;
  url: string;
}
