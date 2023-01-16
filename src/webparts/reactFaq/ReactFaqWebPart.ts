import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';

import * as strings from 'ReactFaqWebPartStrings';
import ReactFaq from './components/ReactFaq';
import { IReactFaqProps } from './components/IReactFaqProps';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IReactFaqWebPartProps {
  listName:string;
  prefLang: string;

}

export default class ReactFaqWebPart extends BaseClientSideWebPart<IReactFaqWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IReactFaqProps > = React.createElement(
      ReactFaq,
      {
        listName:this.properties.listName,
        ServiceScope: this.context.serviceScope,
        prefLang: this.properties.prefLang,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel
                }),
                PropertyPaneDropdown('prefLang', {
                  label: 'Preferred Language',
                  options: [
                    { key: 'account', text: 'Account' },
                    { key: 'en-us', text: 'English' },
                    { key: 'fr-fr', text: 'Français' }
                  ]})
              ]
            }
          ]
        }
      ]
    };
  }
}
