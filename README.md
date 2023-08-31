# Frequently Asked Questions App

## Summary

- This Web Part allows users to create Frequently Asked Questions (FAQ App) in modern and classic SharePoint pages.
- This webpart allows users to search within questions and answers which are stored in a SharePoint FAQ list.
#### FAQ LIST
![Web part preview](assets/FAQLIST.png)
#### FAQ Webpart
![Web part preview](assets/FAQWebpart.png)

## Prerequisites

- FAQ List ( a SharePoint list) should be created wherever the webpart needs to be added with the following fields

Column Name|Field Type
-------|----
`QuestionEN`|Single line of text
`QuestionFR`|Single line of text
`AnswerEN`|Multiple lines of text
`AnswerFR`|Multiple lines of text
`CategoryNameEN`|Single line of text
`CategoryNameFR`|Single line of text
`CategorySortOrder`|Number
`QuestionSortOrder`|Number

- Created List Name should be given in the List Name field in the property pane
- To test the webpart in the workbench, FAQ List should be created in the home page of the site
## API permission
None
## Version 

Used SharePoint Framework Webpart or Sharepoint Framework Extension 

![SPFx 1.8.2](https://img.shields.io/badge/SPFx-1.8.2-green.svg)

![Node.js v10](https://img.shields.io/badge/Node.js-10.24.1-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Version history

Version|Date|Comments
-------|----|--------
1.0.0 | April 25, 2020 | Initial release
1.0.1 | October 30, 2020 | Fix limit 100 items

## Minimal Path to Awesome
- Clone this repository
- Ensure that you are at the solution folder
- Ensure the current version of the Node.js (10.22.0)
- In the command-line run:
  - **npm install**
  - **gulp clean**
  - **gulp serve**
- To debug in the front end:
  - go to the `serve.json` file and update `initialPage` to `https://domain-name.sharepoint.com/_layouts/15/workbench.aspx`
  - Run the command **gulp serve**
- To deploy:
  in the command-line run
  - **gulp clean**
  - **gulp bundle --ship**
  - **gulp package-solution --ship**
- Add the webpart to your tenant app store
- Add the Webpart to a page
- Create FAQ List (a SharePoint List) with following field in the page content of that page
- Edit the webpart and add the FAQ ListName in the List Name field of the property pane

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**