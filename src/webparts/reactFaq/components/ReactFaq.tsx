import * as React from 'react';
import { IReactFaqProps } from './IReactFaqProps';
import { IFaqProp, IFaqServices } from '../../../interface';
import { ServiceScope, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import Autosuggest from 'react-autosuggest';
import { FaqServices } from '../../../services/FaqServices';
//import ReactHtmlParser from 'react-html-parser';
import parse from 'html-react-parser';
import { Icon } from 'office-ui-fabric-react';

//import * as strings from "ReactFaqWebPartStrings";
import { SelectLanguage } from './SelectLanguage';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';


import './index.css';
import ErrorBoundary from './ErrorBoundary';
import './reactAccordion.css';


export interface IFaqState {

  originalData: IFaqProp[];
  actualData: IFaqProp[];
  BusinessCategory: any;
  isLoading: Boolean;
  errorCause: String;
  selectedEntity: any;
  show: Boolean;
  filterData: any;
  searchValue: String;
  filteredCategoryData: any;
  filteredQuestion: String;
  value: String;
  suggestions: any;
  actualCanvasContentHeight: number;
  actualCanvasWrapperHeight: number;
  actualAccordionHeight: number;
}


export default class ReactFaq extends React.Component<IReactFaqProps, IFaqState> {

  private faqServicesInstance: IFaqServices;

  public strings = SelectLanguage(this.props.prefLang);

  constructor(props) {
    super(props);

    this.state = {
      originalData: [],
      actualData: [],
      BusinessCategory: [],
      isLoading: true,
      errorCause: "No Data",
      selectedEntity: [],
      show: false,
      filterData: [],
      searchValue: "",
      filteredCategoryData: [],
      filteredQuestion: '',
      value: '',
      suggestions: [],
      actualCanvasContentHeight: 0,
      actualCanvasWrapperHeight: 0,
      actualAccordionHeight: 0
    };
    try {
      let serviceScope: ServiceScope;
      serviceScope = this.props.ServiceScope;
      if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
        // Mapping to be used when webpart runs in SharePoint.
        this.faqServicesInstance = serviceScope.consume(FaqServices.serviceKey);
      }
      else {

      }
    } catch (error) {
    }
  }


  public onHandleChange = (event, value, FaqData) => {
    if (FaqData.length > 0 && event != undefined) {
      if (value == "") {
        const FaqFilteredData = this.filterByValue(FaqData, value);
        this.setState({ originalData: FaqFilteredData });
      }
      else {
        this.setState({ originalData: this.state.actualData });
      }
    }
  }


  public onChange = (event, { newValue }, method) => {
    if(method === "enter"){
      console.log('enter');
    }else{
      console.log("not enter");
    }

    if (newValue != "") {
      this.setState({
        value: newValue,
      });
    }
    else {

      this.setState({
        originalData: this.state.actualData,
      });
    }
  }

  public onSuggestionSelected = (FaqData, event, method) => {
    var currentTargetText = "";
    if(method.method ==="enter"){
      console.log("enter"+JSON.stringify(method));
      currentTargetText = method.suggestionValue;
    }
    else{
      console.log("click");
      currentTargetText = event.currentTarget.innerText;
    }

    console.log("current "+currentTargetText);
    const FaqFilteredData = this.filterByValue(FaqData, currentTargetText);
    if (FaqFilteredData) {
      console.log("faqdata exist"+ FaqFilteredData.length);
      if (FaqFilteredData.length > 0) {
        var autoSuggestTextbox = document.getElementById("txtSearchBox") as HTMLTextAreaElement;
        autoSuggestTextbox.value = currentTargetText;
        autoSuggestTextbox.blur();
        console.log(autoSuggestTextbox.value);
        let FaqId = FaqFilteredData[0].Id;
        console.log("FAQID",FaqId);
        let FaqCategory = FaqFilteredData[0].CategoryNameEN;
        var catData = [];
        catData.push(FaqCategory);
        this.setState({ filteredCategoryData: catData });
        var nodElem = 'acc-' + FaqCategory;
        var node = document.getElementsByClassName(nodElem);
        var chNode = node[0].children[0].children[0].children[0];
        console.log("CHNODE", chNode);
        var newAttr = document.createAttribute('aria-expanded');
        newAttr.value = 'true';
        chNode.setAttributeNode(newAttr);
        node[0].children[0].children[1].removeAttribute('hidden');
        var FaqNode = this.getFaqElement(FaqId);
        var txtNode = document.getElementById("txtSearchBox");
        var FaqEle = FaqNode[0];
        var newAttrII = document.createAttribute('aria-expanded');
        newAttrII.value = 'true';
        FaqEle.setAttributeNode(newAttrII);
        FaqEle.nextSibling.style.display = 'block';
        FaqEle.nextSibling.removeAttribute('class');
        if (FaqEle.previousElementSibling.previousSibling.classList != undefined) {
          FaqEle.previousElementSibling.previousSibling.classList.add("hideDiv");
        }

        if (FaqEle.previousElementSibling.classList != undefined) {
          FaqEle.previousElementSibling.classList.remove("hideDiv");
        }


        var txtSibEle = txtNode.nextElementSibling;
        txtSibEle.classList.remove("react-autosuggest__suggestions-container--open");
        FaqEle.scrollIntoView({ behavior: 'smooth' });

        if (document.getElementsByClassName("mainContent") != undefined && document.getElementsByClassName("mainContent").length > 0) {
          this.setFaqWebPartHeightDynamic();
        }

      }


    }
  }

    public onSuggestionsFetchRequested = ({ value }) => {
      this.setState({
        suggestions: this.getSuggestions(value)
      });
    }

    public onSuggestionsClearRequested = () => {
      var autoSuggestTextbox = document.getElementById("txtSearchBox") as HTMLTextAreaElement;
      if(autoSuggestTextbox.value == ""){
        autoSuggestTextbox.value = "";
        this.setState({
          suggestions: [],
          value: ""
        });
      }
    }

    // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  public getSuggestionValue = (suggestion) => {
    if (suggestion.length < 0) {
      return "";
    }
    else {
      return (this.strings.Lang == "FR" ? suggestion.QuestionFR : suggestion.QuestionEN);
    }
  }

    public getSuggestions = (value) => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;
      return inputLength === 0 ? [] : this.state.actualData.filter(lang =>
        (lang.QuestionFR.toLowerCase().indexOf(inputValue) !== -1) ||
        (lang.AnswerFR.toLowerCase().indexOf(inputValue) !== -1) ||
        (lang.QuestionEN.toLowerCase().indexOf(inputValue) !== -1) ||
        (lang.AnswerEN.toLowerCase().indexOf(inputValue) !== -1)
      );
    }

    public renderSuggestion = (suggestion) => {
      return (
        <div>
          {(this.strings.Lang =="FR" ? suggestion.QuestionFR : suggestion.QuestionEN)}
        </div>
      );
    }

    public setNodeValues = () => {
      var SPCanvasFirstParent = (document.getElementsByClassName("mainContent") != undefined && document.getElementsByClassName("mainContent").length > 0) ? document.getElementsByClassName("SPCanvas")[0].parentElement.offsetHeight : 0;
      var SPCanvasSecondParent = (document.getElementsByClassName("mainContent") != undefined && document.getElementsByClassName("mainContent").length > 0) ? document.getElementsByClassName("SPCanvas")[0].parentElement.parentElement.offsetHeight : 0;
      this.setState({
        actualCanvasContentHeight: SPCanvasFirstParent,
        actualCanvasWrapperHeight: SPCanvasSecondParent
      }, this.dynamicHeight);
    }

    public async componentDidMount() {
      if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
        this.loadFaq();
      }
      else {
        //await this.loadMockFaq();
      }
      this.setState({
        actualAccordionHeight: (document.getElementsByClassName("accordion") != undefined && document.getElementsByClassName("accordion").length > 0) ? document.getElementsByClassName("accordion")[0].parentElement.offsetHeight : 0
      });
      var ua = window.navigator.userAgent;
      var trident = ua.indexOf('Trident/');

      if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        if ((parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)) < 12) {
          document.getElementById("txtSearchBox").style.paddingTop = '3px';
        }
      }
    }

    public async loadFaq() {
      await this.faqServicesInstance.getFaq(this.props.listName).then((FaqData: IFaqProp[]) => {
        try {
          this.setState(
            {
              actualData: FaqData,
              originalData: FaqData
            }
          );
        }
        catch (error) {
          console.log("Error Occurred :" + error);
        }

      });
    }

      public categoryAndQuestionSorting = (Data) => {
        var result = [];
        // Get Distinct category for sorting Category
        var distCate = this.distinct(Data, "CategoryNameEN");
        distCate.sort((c, d) => {
          return c.CategorySortOrder - d.CategorySortOrder;
        });

        //Sorting the FQA as per CategorySortOrder
        distCate.forEach((distCateItem) => {
          Data.map((item) => {
            if (distCateItem.CategoryNameEN.toLowerCase() == item.CategoryNameEN.toLowerCase()) {
              result.push(item);
            }
          });
        });

        //Sorting the FQA as per QuestionSortOrder
        result.sort((a, b) => {
          return a.QuestionSortOrder - b.QuestionSortOrder;
        });
        return result;
      }

      public distinct(items, prop) {
        var unique = [];
        var distinctItems = [];
        for (const item of items) {
          if (unique[item[prop]] === undefined) {
            distinctItems.push(item);
          }

          unique[item[prop]] = 0;
        }
        return distinctItems;
      }

      public filterByValue = (arrayData, value) => {
          return arrayData.filter(o =>
          this.includes(o["QuestionEN"].toLowerCase(), value.toLowerCase()) || this.includes(o["AnswerEN"].toLowerCase(), value.toLowerCase()) || this.includes(o["QuestionFR"].toLowerCase(), value.toLowerCase()) || this.includes(o["AnswerFR"].toLowerCase(), value.toLowerCase())
        );
      }

      public getFaqElement = (FaqId) => {
        return Array.prototype.filter.call(
          document.getElementsByTagName('span'),
          (el) => el.getAttribute('data-id') == FaqId
        );
      }

      public formatDate = (ModifiedDate) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dt = new Date(ModifiedDate);
        var hours = dt.getHours();
        var minutes = dt.getMinutes();
        var secs = dt.getSeconds();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        var strTime = hours + ':' + minutes + ':' + secs + ' ' + ampm;

        return monthNames[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear() + " " + strTime;
      }

      public loadMoreEventFromKeybord(event: any): void{
        //Only if enter press
        if (event.keyCode === 13) {
        this.loadMoreEvent(event);
        }
      }

      public loadMoreEvent(event: any): void {

        var clickedId = event.target.getAttribute('data-id');
        console.log('clicked - ' + clickedId + ' ' + event.target);

        console.log(event.target.nodeName);
        if (event.target.nodeName === "SPAN") {
          if (event.target.nextElementSibling.classList.contains("hideDiv")) {
            event.target.nextElementSibling.classList.remove("hideDiv");

            try {

              if (event.currentTarget.children[0].classList != undefined) {
                event.currentTarget.children[0].classList.add("hideDiv");
              }


              if (event.currentTarget.children[1].classList != undefined) {
                event.currentTarget.children[1].classList.remove("hideDiv");
              }

            }
            catch (e) { }
          }
          else {
            event.target.nextElementSibling.classList.add("hideDiv");
            try {
              if (event.currentTarget.children[1].classList != undefined) {
                event.currentTarget.children[1].classList.add("hideDiv");
              }

              if (event.currentTarget.children[0].classList != undefined) {
                event.currentTarget.children[0].classList.remove("hideDiv");
              }
              event.currentTarget.children[3].removeAttribute("style");

            }
            catch (e) { }
          }
        }
          else {

            if (event.target.nodeName === "I") {

              if (event.target.dataset.iconName  === 'chevrondown') {
                console.log("evenTarget1", event.target.className);
                console.log("evenTarget3", event.target.nextElementSibling.nextElementSibling.nextElementSibling.className);
                event.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove("hideDiv"); //answer
                event.target.nextElementSibling.classList.remove("hideDiv"); //span
                event.target.classList.add("hideDiv");
              }

              if (event.target.dataset.iconName  === 'chevronup') {
                event.target.nextElementSibling.nextElementSibling.classList.add("hideDiv");//answer
                event.target.previousElementSibling.classList.remove("hideDiv"); //chevdown
                event.target.classList.add("hideDiv");//chevup
              }

              event.currentTarget.children[3].removeAttribute("style");


          }
        }
        if (document.getElementsByClassName("mainContent") != undefined && document.getElementsByClassName("mainContent").length > 0) {
          this.setFaqWebPartHeightDynamic();
        }
      }

      public dynamicHeight = () => {
        var SPCanvasNode = document.getElementsByClassName("SPCanvas");
        var accordionNode = document.getElementsByClassName("accordion");
        if (SPCanvasNode.length > 0 && accordionNode.length > 0) {
          SPCanvasNode[0].parentElement.style.height = (this.state.actualCanvasContentHeight + (accordionNode[0].parentElement.offsetHeight - this.state.actualAccordionHeight)) + "px";
          SPCanvasNode[0].parentElement.parentElement.style.height = (this.state.actualCanvasWrapperHeight + (accordionNode[0].parentElement.offsetHeight - this.state.actualAccordionHeight)) + "px";
        }
      }

      public setFaqWebPartHeightDynamic = () => {
        if (this.state.actualCanvasContentHeight == 0) {
          this.setNodeValues();
        }
        else {
          this.dynamicHeight();
        }
      }

      public accordionOnchange = () => {
        if (document.getElementsByClassName("mainContent") != undefined && document.getElementsByClassName("mainContent").length > 0) {
          this.setFaqWebPartHeightDynamic();
        }
      }

      public includes = (container, value) => {
        var returnValue = false;
        var pos = container.indexOf(value);
        if (pos >= 0) {
          returnValue = true;
        }
        return returnValue;
      }

  public render(): React.ReactElement<IReactFaqProps> {
    var uniqueBC = [];
    var FaqData = [];

    if (this.state.originalData.length > 0) {
      FaqData = this.categoryAndQuestionSorting(this.state.originalData);
      uniqueBC = this.distinct(FaqData, "BusinessCategory");
    }

    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: this.strings.placeholderSearch,
      value,
      onChange: this.onChange,
      id: 'txtSearchBox',
      'aria-label': this.strings.searchLabel
    };

    const userLang = this.strings.Lang;

    return (
      <div className={`container`}>

        <div className="FaqSearchBox" accept-charset="UTF-8">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            onSuggestionSelected={this.onSuggestionSelected.bind(this, this.state.actualData)}
            inputProps={inputProps}
            focusInputOnSuggestionClick={false}
            focusFirstSuggestion={true}
          />
        </div>
        <ErrorBoundary>

          <div className="clearBody">

            <Accordion allowMultipleExpanded={true} allowZeroExpanded={true} onChange={this.accordionOnchange.bind(this)} preExpanded={this.state.filteredCategoryData}
            >
              {uniqueBC.map((item) => (
                <div>
                  {this.distinct(FaqData, "CategoryNameEN").map((allCat) => (
                    <div className={`acc-${allCat.CategoryNameEN} accordeonBlock`}>
                      <AccordionItem uuid={allCat.CategoryNameEN}>
                        <AccordionItemHeading>
                          <AccordionItemButton >
                            {(userLang == "EN" ? allCat.CategoryNameEN : allCat.CategoryNameFR)}
                          </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                          <div className="acc-item-panel">
                            {FaqData.filter(it => it.CategoryNameEN == allCat.CategoryNameEN).map((allFaq) => (

                              <div
                                className="acc-item"
                                data-id={allFaq.Id}
                                onClick={
                                  event => this.loadMoreEvent(event)
                                }>

                                <Icon id="chevrondown" iconName="chevrondown" aria-label={this.strings.iconPlusLabel} data-id={allFaq.Id} className={'plusminusImg'}></Icon>
                                <Icon id="chevronup" iconName="chevronup" aria-label={this.strings.iconMinusLabel} data-id={allFaq.Id} className={"plusminusImg hideDiv"}></Icon>

                                <span tabIndex={0} onKeyUp={event => this.loadMoreEventFromKeybord(event)} className="acc-span-text" data-id={allFaq.Id}>{(userLang == "EN" ? allFaq.QuestionEN : allFaq.QuestionFR)}</span>
                                <div className="hideDiv">
                                  <div className="acc-answer">
                                    {parse((userLang == "EN" ? allFaq.AnswerEN : allFaq.AnswerFR))}
                                  </div>
                                </div>
                              </div>

                            ))}
                          </div>
                        </AccordionItemPanel>
                      </AccordionItem>
                    </div>
                  ))}
                </div>
              ))}
            </Accordion>
          </div>
        </ErrorBoundary>
      </div>
    );

  }
}
