import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';

import ReactFaq from './components/ReactFaq';
import { IReactFaqProps } from './components/IReactFaqProps';
import { SelectLanguage } from "./components/SelectLanguage";

export interface IReactFaqWebPartProps {
  listName:string;
  prefLang: string;
}

export default class ReactFaqWebPart extends BaseClientSideWebPart<IReactFaqWebPartProps> {
  private strings: IReactFaqWebPartStrings;

  protected async onInit(): Promise<void> {
    this.strings = SelectLanguage(this.properties.prefLang);
  }

  public render(): void {
    const element: React.ReactElement<IReactFaqProps> = React.createElement(
      ReactFaq,
      {
        listName: this.properties.listName,
        ServiceScope: this.context.serviceScope,
        prefLang: this.properties.prefLang,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: this.strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: this.strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("listName", {
                  label: this.strings.ListNameFieldLabel,
                }),
                PropertyPaneDropdown("prefLang", {
                  label: "Preferred Language",
                  options: [
                    { key: "account", text: "Account" },
                    { key: "en-us", text: "English" },
                    { key: "fr-fr", text: "Français" },
                  ],
                  selectedKey: this.strings.userLang,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
