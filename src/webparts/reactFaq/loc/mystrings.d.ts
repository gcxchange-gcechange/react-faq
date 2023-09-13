declare interface IReactFaqWebPartStrings {
  userLang: string;
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  ListNameFieldLabel: string;
  Lang: string;
  searchLabel: string;
  placeholderSearch: string;
  iconPlusLabel: string;
  iconMinusLabel: string;
}

declare module 'ReactFaqWebPartStrings' {
  const strings: IReactFaqWebPartStrings;
  export = strings;
}
