import * as React from 'react';
import { IReactFaqProps } from './IReactFaqProps';
import { IFaqProp, IFaqServices } from '../../../interface';
import { ServiceScope, ServiceKey, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import Autosuggest from 'react-autosuggest';
import { FaqServices } from '../../../services/FaqServices';
import ReactHtmlParser from 'react-html-parser';





//import * as strings from "ReactFaqWebPartStrings";
import { SelectLanguage } from './SelectLanguage';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

import 'react-accessible-accordion/dist/fancy-example.css';
import './index.css';
import ErrorBoundary from './ErrorBoundary';
import './reactAccordion.css';
import { Icon } from 'office-ui-fabric-react';


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
      filteredQuestion: "",
      value: "",
      suggestions: [],
      actualCanvasContentHeight: 0,
      actualCanvasWrapperHeight: 0,
      actualAccordionHeight: 0,
    };
    try {
      let serviceScope: ServiceScope;
      serviceScope = this.props.ServiceScope;
      if (
        Environment.type == EnvironmentType.SharePoint ||
        Environment.type == EnvironmentType.ClassicSharePoint
      ) {
        // Mapping to be used when webpart runs in SharePoint.
        this.faqServicesInstance = serviceScope.consume(FaqServices.serviceKey);
      } else {
      }
    } catch (error) {}
  }

  public onHandleChange = (event, value, FaqData) => {
    if (FaqData.length > 0 && event != undefined) {
      if (value == "") {
        const FaqFilteredData = this.filterByValue(FaqData, value);
        this.setState({ originalData: FaqFilteredData });
      } else {
        this.setState({ originalData: this.state.actualData });
      }
    }
  }

  public onChange = (event, { newValue }, method) => {
    if (method === "enter") {
      console.log("enter");
    } else {
      console.log("not enter");
    }

    if (newValue != "") {
      this.setState({
        value: newValue,
      });
    } else {
      this.setState({
        originalData: this.state.actualData,
      });
    }
  }

  public onSuggestionSelected = (FaqData, event, method) => {
    var currentTargetText = "";
    if (method.method === "enter") {
      console.log("enter" + JSON.stringify(method));
      currentTargetText = method.suggestionValue;
    } else {
      console.log("click");
      currentTargetText = event.currentTarget.innerText;
    }

    console.log("current " + currentTargetText);
    const FaqFilteredData = this.filterByValue(FaqData, currentTargetText);
    if (FaqFilteredData) {
      console.log("faqdata exist" + FaqFilteredData.length);
      if (FaqFilteredData.length > 0) {
        var autoSuggestTextbox = document.getElementById(
          "txtSearchBox"
        ) as HTMLTextAreaElement;
        autoSuggestTextbox.value = currentTargetText;
        autoSuggestTextbox.blur();
        console.log(autoSuggestTextbox.value);
        let FaqId = FaqFilteredData[0].Id;
        console.log(FaqId);
        let FaqCategory = FaqFilteredData[0].CategoryNameEN;
        var catData = [];
        catData.push(FaqCategory);
        this.setState({ filteredCategoryData: catData });
        var nodElem = "acc-" + FaqCategory;
        var node = document.getElementsByClassName(nodElem);
        var chNode = node[0].children[0].children[0].children[0];
        var newAttr = document.createAttribute("aria-expanded");
        newAttr.value = "true";
        chNode.setAttributeNode(newAttr);
        node[0].children[0].children[1].removeAttribute("hidden");
        var FaqNode = this.getFaqElement(FaqId);
        var txtNode = document.getElementById("txtSearchBox");
        var FaqEle = FaqNode[0];
        var newAttrII = document.createAttribute("aria-expanded");
        newAttrII.value = "true";
        FaqEle.setAttributeNode(newAttrII);
        FaqEle.nextSibling.style.display = "block";
        FaqEle.nextSibling.removeAttribute("class");
        if (
          FaqEle.previousElementSibling.previousSibling.classList != undefined
        ) {
          FaqEle.previousElementSibling.previousSibling.classList.add(
            "hideDiv"
          );
        } else {
          // IE11 does not implement classList on <svg>
          let appliedClasses =
            FaqEle.previousElementSibling.previousSibling.getAttribute(
              "class"
            ) || "";
          appliedClasses =
            appliedClasses.split(" ").indexOf("hideDiv") == -1
              ? appliedClasses + " hideDiv"
              : appliedClasses;
          FaqEle.previousElementSibling.previousSibling.setAttribute(
            "class",
            appliedClasses
          );
        }
        if (FaqEle.previousElementSibling.classList != undefined) {
          FaqEle.previousElementSibling.classList.remove("hideDiv");
        } else {
          // IE11 does not implement classList on <svg>
          let appliedClassesII =
            FaqEle.previousElementSibling.getAttribute("class") || "";
          appliedClassesII =
            appliedClassesII.split(" ").indexOf("hideDiv") != -1
              ? appliedClassesII.replace(" hideDiv", "")
              : appliedClassesII + " hideDiv";
          FaqEle.previousElementSibling.setAttribute("class", appliedClassesII);
        }

        var txtSibEle = txtNode.nextElementSibling;
        txtSibEle.classList.remove(
          "react-autosuggest__suggestions-container--open"
        );
        FaqEle.scrollIntoView({ behavior: "smooth" });

        if (
          document.getElementsByClassName("mainContent") != undefined &&
          document.getElementsByClassName("mainContent").length > 0
        ) {
          this.setFaqWebPartHeightDynamic();
        }
      }
    }
  }

  public onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  }

  public onSuggestionsClearRequested = () => {
    var autoSuggestTextbox = document.getElementById(
      "txtSearchBox"
    ) as HTMLTextAreaElement;
    if (autoSuggestTextbox.value == "") {
      autoSuggestTextbox.value = "";
      this.setState({
        suggestions: [],
        value: "",
      });
    }
  }

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  public getSuggestionValue = (suggestion) => {
    if (suggestion.length < 0) {
      return "";
    } else {
      return this.strings.Lang == "FR"
        ? suggestion.QuestionFR
        : suggestion.QuestionEN;
    }
  }

  public getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : this.state.actualData.filter(
          (lang) =>
            lang.QuestionFR.toLowerCase().indexOf(inputValue) !== -1 ||
            lang.AnswerFR.toLowerCase().indexOf(inputValue) !== -1 ||
            lang.QuestionEN.toLowerCase().indexOf(inputValue) !== -1 ||
            lang.AnswerEN.toLowerCase().indexOf(inputValue) !== -1
        );
  }

  public renderSuggestion = (suggestion) => {
    return (
      <div>
        {this.strings.Lang == "FR"
          ? suggestion.QuestionFR
          : suggestion.QuestionEN}
      </div>
    );
  }

  public setNodeValues = () => {
    var SPCanvasFirstParent =
      document.getElementsByClassName("mainContent") !== undefined &&
      document.getElementsByClassName("mainContent").length > 0
        ? document.getElementsByClassName("SPCanvas")[0].parentElement
            .offsetHeight
        : 0;
    var SPCanvasSecondParent =
      document.getElementsByClassName("mainContent") !== undefined &&
      document.getElementsByClassName("mainContent").length > 0
        ? document.getElementsByClassName("SPCanvas")[0].parentElement
            .parentElement.offsetHeight
        : 0;
    this.setState(
      {
        actualCanvasContentHeight: SPCanvasFirstParent,
        actualCanvasWrapperHeight: SPCanvasSecondParent,
      },
      this.dynamicHeight
    );
  }

  public async componentDidMount() {
    if (
      Environment.type == EnvironmentType.SharePoint ||
      Environment.type == EnvironmentType.ClassicSharePoint
    ) {
      this.loadFaq();
    } else {
      //await this.loadMockFaq();
    }
    this.setState({
      actualAccordionHeight:
        document.getElementsByClassName("accordion") != undefined &&
        document.getElementsByClassName("accordion").length > 0
          ? document.getElementsByClassName("accordion")[0].parentElement
              .offsetHeight
          : 0,
    });
    var ua = window.navigator.userAgent;
    var trident = ua.indexOf("Trident/");

    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf("rv:");
      if (parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10) < 12) {
        document.getElementById("txtSearchBox").style.paddingTop = "3px";
      }
    }
  }

  public async loadFaq() {
    await this.faqServicesInstance
      .getFaq(this.props.listName)
      .then((FaqData: IFaqProp[]) => {
        try {
          this.setState({
            actualData: FaqData,
            originalData: FaqData,
          });
        } catch (error) {
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
        if (
          distCateItem.CategoryNameEN.toLowerCase() ==
          item.CategoryNameEN.toLowerCase()
        ) {
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
  //categories

  public distinct(items, prop) {
    let unique = [];
    let distinctItems = [];
    for (const item of items) {
      if (unique[item[prop]] === undefined) {
        distinctItems.push(item);
      }

      unique[item[prop]] = 0;
    }
    return distinctItems;
  }

  public filterByValue = (arrayData, value) => {
    return arrayData.filter(
      (o) =>
        this.includes(o["QuestionEN"].toLowerCase(), value.toLowerCase()) ||
        this.includes(o["AnswerEN"].toLowerCase(), value.toLowerCase()) ||
        this.includes(o["QuestionFR"].toLowerCase(), value.toLowerCase()) ||
        this.includes(o["AnswerFR"].toLowerCase(), value.toLowerCase())
    );
  }

  public getFaqElement = (FaqId) => {
    return Array.prototype.filter.call(
      document.getElementsByTagName("span"),
      (el) => el.getAttribute("data-id") == FaqId
    );
  }

  public formatDate = (ModifiedDate) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dt = new Date(ModifiedDate);
    var hours = dt.getHours();
    var minutes = dt.getMinutes();
    var secs = dt.getSeconds();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var strTime = hours + ":" + minutes + ":" + secs + " " + ampm;

    return (
      monthNames[dt.getMonth()] +
      " " +
      dt.getDate() +
      ", " +
      dt.getFullYear() +
      " " +
      strTime
    );
  }

  public loadMoreEventFromKeybord(event: any): void {
    //Only if enter press
    if (event.keyCode === 13) {
      this.loadMoreEvent(event);
    }
  }

  public loadMoreEvent(event: any): void {
    let clickedId = event.target.getAttribute("data-id");
    console.log("clicked - " + clickedId + " " + event.target);

    console.log("EVENT TARGET NODENAME", event.target.nodeName);

    //if SPAN is selected
    if (event.target.nodeName === "SPAN") {
      //if event.target.SPAN nextSibling = DIV contains "hideDIV" remove to show it
      if (event.target.nextElementSibling.classList.contains("hideDiv")) {
        console.log("ShowAnswer", event.target.nextElementSibling.classList);
        event.target.nextElementSibling.classList.remove("hideDiv");

        try {
          //if event.currentTarget div-acc-item child[0] = chevronDown exists then hide it.
          if (event.currentTarget.children[0].classList !== undefined) {
            console.log("CHILD [0]", event.currentTarget);
            event.currentTarget.children[0].classList.add("hideDiv");
          }
          //if event.currentTarget div-acc-item child[1] = chevronUp exists then make it visible.
          if (event.currentTarget.children[1].classList !== undefined) {
            console.log("Child[1]", event.currentTarget.children[1].classList);
            event.currentTarget.children[1].classList.remove("hideDiv");
          }
        } catch (e) {
          console.log("error", e);
        }
      } else {
        //if event.target.SPAN nextSibling = DIV add "hideDIV" to hide it
        event.target.nextElementSibling.classList.add("hideDiv");
        console.log("hideAnswer", event.target.nextElementSibling.classList);

        try {
          //if  currentTarget = div-acc-item child [1] = chevron up then hide it
          if (event.currentTarget.children[1].classList !== undefined) {
            console.log("hideChevronUp", event.currentTarget);
            event.currentTarget.children[1].classList.add("hideDiv");
          }
          //if  currentTarget = div-acc-item child [0] = chevron down make visible
          if (event.currentTarget.children[0].classList != undefined) {
            console.log("see Chevdown", event.currentTarget);
            event.currentTarget.children[0].classList.remove("hideDiv");
          }
        } catch (e) {
          console.log("error2", e);
        }
      }
    } else {
      //if Chevrons are selected by user do the following:
      if (event.target.nodeName === "I") {

        // FIRST show the answer and change the Icons - remove class Hide Div from the answer to show it .
        if (event.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.contains("hideDiv")) {

          console.log("IconShowAnswer", event.target.nextElementSibling.nextElementSibling.nextElementSibling.classList);
          event.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove("hideDiv");

          // try {
          //   //if event.currentTarget div-acc-item child[0] = chevronDown exists then hide it.
          //   if (event.currentTarget.children[0].classList !== undefined) {
          //     console.log("HideChevDown", event.currentTarget.children[0].classList);
          //     event.currentTarget.children[0].classList.add("hideDiv");
          //   }

          //   //if event.currentTarget div-acc-item child[1] = chevronUp exists then make it visible.
          //   if (event.currentTarget.children[1].classList !== undefined) {
          //     console.log("showChevUp", event.currentTarget.children[1].classList);
          //     event.currentTarget.children[1].classList.remove("hideDiv");
          //   }
          // } catch (e) {
          //   console.log("Error for Icon", e);
          // }

        } else {
          // HERE is where Answer collapses and Icon change as well.
          // event.target.nextElementSibling.nextElementSibling.classList.contains("hideDiv"))
          console.log("HideEventTarget", event.target);
          event.target.nextElementSibling.nextElementSibling.classList.add("hideDiv");
          // event.target.nextElementSibling.nextElementSibling.classList.add("hideDiv");
          if (event.target.getAttribute('data-icon') === "chevronup") {
              console.log('HI', event.target.getElementsByTagName);
              event.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove("hideDiv");
              event.target.nextElementSibling.classList.remove("hideDiv");
              event.target.classList.add("hideDiv");
            }

          if (event.target.previousElementSibling.classList !== undefined) {
            event.target.previousElementSibling.classList.remove("hideDiv");
          }
        }
      }
    }
  }

  public loadMoreEvent1(event: any): void {
    // debugger

    let clickedId = event.target.getAttribute("data-id");
    console.log("clicked - " + clickedId + " " + event.target);

    console.log("EVENT TARGET NODENAME", event.target.nodeName);

    //if click on TEXT which is a SPAN //
    if (event.target.nodeName === "SPAN") {
      //1st nested condition//
      //if chevron up  and the next sibling Icon chevdown contain hideDiv we removed it - acc-answer div
      if (event.target.nextElementSibling.classList.contains("hideDiv")) {
        console.log("NEXT sibling", event.target.nextElementSibling.className);
        event.target.nextElementSibling.classList.remove("hideDiv");

        try {
          //if it exist we remove hideDiv to classList plusminusImg root 119(chevronup)//
          if (event.currentTarget.children[0].classList !== undefined) {
            console.log("CHILD [0]", event.currentTarget.children[0].classList);
            event.currentTarget.children[0].classList.add("hideDiv");
          }
          // else {
          //   // IE11 does not implement classList on <svg>
          //   let appliedClasses = event.currentTarget.children[0].getAttribute("class") || "";
          //   console.log("appliedClass", appliedClasses);
          //   appliedClasses = appliedClasses.split(" ").indexOf("hideDiv") === -1
          //     ? appliedClasses + " hideDiv"
          //     : appliedClasses;
          //   event.currentTarget.children[0].setAttribute('class', appliedClasses);
          // }
          //if it exist we remove hideDiv to classList plusminusImg root 119(chevronup) hideDiv//
          if (event.currentTarget.children[1].classList !== undefined) {
            console.log("Child[1]", event.currentTarget.children[1].classList);
            event.currentTarget.children[1].classList.remove("hideDiv");
          }
          // else {
          //   // IE11 does not implement classList on <svg>
          //   let appliedClassesII = event.currentTarget.children[1].getAttribute("class") || "";
          //   appliedClassesII = appliedClassesII.split(" ").indexOf("hideDiv") != -1
          //     ? appliedClassesII.replace(" hideDiv", "")
          //     : appliedClassesII + " hideDiv";
          //   event.currentTarget.children[1].setAttribute('class', appliedClassesII);
          // }
          // event.currentTarget.children[3].removeAttribute("style");
          // console.log("CHILD[3]", event.currentTarget.children[3].classList);
        } catch (e) {
          console.log("error", e);
        }
      } else {
        //this hides the div with the answer classList hideDiv//
        event.target.nextElementSibling.classList.add("hideDiv");
        console.log("afterSibling", event.target.nextElementSibling.classList);
        try {
          if (event.currentTarget.children[1].classList !== undefined) {
            event.currentTarget.children[1].classList.add("hideDiv");
          } else {
            // IE11 does not implement classList on <svg>
            let appliedClasses =
              event.currentTarget.children[1].getAttribute("class") || "";
            appliedClasses =
              appliedClasses.split(" ").indexOf("hideDiv") == -1
                ? appliedClasses + " hideDiv"
                : appliedClasses;
            event.currentTarget.children[1].setAttribute(
              "class",
              appliedClasses
            );
          }

          if (event.currentTarget.children[0].classList != undefined) {
            event.currentTarget.children[0].classList.remove("hideDiv");
          } else {
            // IE11 does not implement classList on <svg>
            let appliedClassesII =
              event.currentTarget.children[0].getAttribute("class") || "";
            appliedClassesII =
              appliedClassesII.split(" ").indexOf("hideDiv") != -1
                ? appliedClassesII.replace(" hideDiv", "")
                : appliedClassesII + " hideDiv";
            event.currentTarget.children[0].setAttribute(
              "class",
              appliedClassesII
            );
          }
          event.currentTarget.children[3].removeAttribute("style");
        } catch (e) {}
      }
    } else {
      if (event.target.nodeName === "I") {
        //currentTarget is acc-item child[1] = chevronup
        //add hideDiv to child[0] = chevdown
        //remove hideDiv from child[1] so that the chevdown shows
        //show the DIV answer - remove the hideDiv from child[3] which is the div that wraps the answer

        if (event.currentTarget.children[0]) {
          //click on chevrondown
          console.log("CurrentTargetName", event.currentTarget.className);
          console.log("CHEVUP CHILD 0", event.currentTarget.children[0]);
          event.currentTarget.children[0].classList.add("hideDiv");
          event.currentTarget.children[1].classList.remove("hideDiv");
          event.currentTarget.children[3].classList.remove("hideDiv");
        }

        //event.currentTarget = acc-item
        //event.currentTarget.child[0]= i.plusminusImg.root-119.hideDiv == chevronDOwn
        //event.currentTarget.child[1] = i.plusminusImg.root-119 = chevron UP
        //event.currentTarget.child[2] = span.acc-span-text
        //event.currentTarget.child[3] = span.acc-span-text

        //     else {
        //       // IE11 does not implement classList on <svg>
        //       let appliedClasses = event.currentTarget.children[0].getAttribute("class") || "";
        //       appliedClasses = appliedClasses + " hideDiv";
        //       event.currentTarget.children[0].setAttribute('class', appliedClasses);
        //       let appliedClassesII = event.currentTarget.children[1].getAttribute("class") || "";
        //       appliedClassesII = appliedClassesII + " hideDiv";
        //       event.currentTarget.children[1].setAttribute('class', appliedClassesII);
        //     }
        // if (event.target.parentElement.getAttribute('data-icon') === "chevrondown") {
        //   console.log("CD",  event.target.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.className);
        //   event.target.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.classList.add("hideDiv");
        // }

        //CHILD 1 = Chevron UP ICON

        // if(event.target.dataset.iconName === "chevronup") {
        //   console.log("Target", event.target);
        //   console.log("CurrentTarget", event.currentTarget);
        //   console.log("child new 1",event.target.previousElementSibling);
        //   console.log("Parent-firstChild", event.target.className);
        //   console.log("previousElementSibling", event.target.previousElementSibling.classList);
        //   event.currentTarget.previousElementSibling.classList.remove("hideDiv");
        //   event.currentTarget.nextElementSibling.nextElementSibling.classList.add("hideDiv");
        //   event.currentTarget.parentElement.classList.add("hideDiv");
        // }
        if (event.currentTarget.children[1].classList !== undefined) {
          console.log("REMOVE", event.currentTarget.children[0].className);
          event.currentTarget.children[0].classList.add("hideDiv");
        }
        //       else {
        //         // IE11 does not implement classList on <svg>
        //         let appliedClassesII = event.currentTarget.children[1].getAttribute("class") || "";
        //         appliedClassesII = appliedClassesII.split(" ").indexOf("hideDiv") != -1
        //           ? appliedClassesII.replace(" hideDiv", "")
        //           : appliedClassesII + " hideDiv";
        //         event.currentTarget.children[1].setAttribute('class', appliedClassesII);
        //       }
        //     }
        // else {
        //   event.target.parentElement.nextElementSibling.nextElementSibling.classList.add("hideDiv");
        //   event.target.parentElement.nextElementSibling.nextElementSibling.removeAttribute("style");
        //    if (event.currentTarget.children[0].classList != undefined) {
        //     event.currentTarget.children[0].classList.remove("hideDiv");
        //   }

        //       else {
        //         // IE11 does not implement classList on <svg>
        //         let appliedClassesII = event.currentTarget.children[0].getAttribute("class") || "";
        //         appliedClassesII = appliedClassesII.split(" ").indexOf("hideDiv") != -1
        //           ? appliedClassesII.replace(" hideDiv", "")
        //           : appliedClassesII + " hideDiv";
        //         event.currentTarget.children[0].setAttribute('class', appliedClassesII);
        //       }
        //     }
      }
      //Conditions for the CHEVRON Icon//
      // else if (event.target.nodeName === "I") {
      //   console.log("THIS IS I", event.target.nextElementSibling);

      //  if (event.target.classList !== undefined) {
      //   console.log(event.target.classList);
      //     event.target.classList.add("hideDiv");
      //   }
      //     else {
      //       // IE11 does not implement classList on <svg>
      //       let appliedClasses = event.target.getAttribute("class") || "";
      //       appliedClasses = appliedClasses + " hideDiv";
      //       event.target.setAttribute('class', appliedClasses);
      //     }
      //     alert('path');
      // if (event.target.getAttribute('data-icon') === "chevrondown") {
      //   console.log('another HI', event.target.nextElementSibling.nextElementSibling.nextElementSibling.className);
      //   event.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove("hideDiv");
      //   event.target.nextElementSibling.nextElementSibling.nextElementSibling.focus;
      //       //event.target.nextElementSibling.classList.remove("hideDiv");

      //       if (event.target.nextElementSibling.classList !== undefined) {
      //         console.log("here");
      //         event.target.nextElementSibling.classList.remove("hideDiv");
      //         event.target.nextElementSibling.focus;
      //       }
      //       else {
      //         // IE11 does not implement classList on <svg>
      //         let appliedClassesII = event.target.nextElementSibling.getAttribute("class") || "";
      //         appliedClassesII = appliedClassesII.split(" ").indexOf("hideDiv") !== -1
      //           ? appliedClassesII.replace(" hideDiv", "")
      //           : appliedClassesII + " hideDiv";
      //         event.target.nextElementSibling.setAttribute('class', appliedClassesII);
      //       }
      // }
      //     else {
      //       event.target.nextElementSibling.nextElementSibling.classList.add("hideDiv");
      //       event.target.nextElementSibling.nextElementSibling.removeAttribute("style");
      //       if (event.target.previousElementSibling.classList !== undefined) {
      //         event.target.previousElementSibling.classList.remove("hideDiv");
      //       }
      //       else {
      //         // IE11 does not implement classList on <svg>
      //         let appliedClassesII = event.target.previousElementSibling.getAttribute("class") || "";
      //         appliedClassesII = appliedClassesII.split(" ").indexOf("hideDiv") != -1
      //           ? appliedClassesII.replace(" hideDiv", "")
      //           : appliedClassesII + " hideDiv";
      //         event.target.previousElementSibling.setAttribute('class', appliedClassesII);
      //       }
      //     }

      //   }
      // else {
      // if (event.target.getAttribute('data-icon') === "chevronup") {
      //   console.log('HI', event.target.getElementsByTagName);
      //   event.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove("hideDiv");
      //   event.target.nextElementSibling.classList.remove("hideDiv");
      //   event.target.classList.add("hideDiv");
      // }
      //     else {
      //       event.target.nextElementSibling.nextElementSibling.classList.add("hideDiv");
      //       event.target.previousElementSibling.classList.add("hideDiv");
      //       event.target.classList.add("hideDiv");
      //       event.target.removeAttribute("style");
      // }
      // }
    }
    if (
      document.getElementsByClassName("mainContent") != undefined &&
      document.getElementsByClassName("mainContent").length > 0
    ) {
      this.setFaqWebPartHeightDynamic();
    }
  }

  public dynamicHeight = () => {
    var SPCanvasNode = document.getElementsByClassName("SPCanvas");
    var accordionNode = document.getElementsByClassName("accordion");
    if (SPCanvasNode.length > 0 && accordionNode.length > 0) {
      SPCanvasNode[0].parentElement.style.height =
        this.state.actualCanvasContentHeight +
        (accordionNode[0].parentElement.offsetHeight -
          this.state.actualAccordionHeight) +
        "px";
      SPCanvasNode[0].parentElement.parentElement.style.height =
        this.state.actualCanvasWrapperHeight +
        (accordionNode[0].parentElement.offsetHeight -
          this.state.actualAccordionHeight) +
        "px";
    }
  }

  public setFaqWebPartHeightDynamic = () => {
    if (this.state.actualCanvasContentHeight === 0) {
      this.setNodeValues();
    } else {
      this.dynamicHeight();
    }
  }

  public accordionOnchange = () => {
    if (
      document.getElementsByClassName("mainContent") !== undefined &&
      document.getElementsByClassName("mainContent").length > 0
    ) {
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
      id: "txtSearchBox",
      "aria-label": this.strings.searchLabel,
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
            onSuggestionSelected={this.onSuggestionSelected.bind(
              this,
              this.state.actualData
            )}
            inputProps={inputProps}
            focusInputOnSuggestionClick={false}
            focusFirstSuggestion={true}
          />
        </div>
        <ErrorBoundary>
          <div className="clearBody">
            <Accordion
              allowMultipleExpanded={true}
              allowZeroExpanded={true}
              onChange={this.accordionOnchange.bind(this)}
              preExpanded={this.state.filteredCategoryData}
            >
              {uniqueBC.map((item) => (
                <div>
                  {this.distinct(FaqData, "CategoryNameEN").map((allCat) => (
                    <div
                      className={`acc-${allCat.CategoryNameEN} accordionBlock`}
                    >
                      <AccordionItem uuid={allCat.Id}>
                        <AccordionItemHeading>
                          <AccordionItemButton>
                            {userLang === "EN"
                              ? allCat.CategoryNameEN
                              : allCat.CategoryNameFR}
                          </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                        {FaqData.filter((items)=> items.CategoryNameEN == allCat.CategoryNameEN).map((allFAQ) => (
                          <AccordionItem>
                            <AccordionItemHeading>
                              <AccordionItemButton className='secondLevel'>
                                <div className={"white"}>
                                    {userLang == "EN"
                                    ? allFAQ.QuestionEN
                                    : allFAQ.QuestionFR}</div>
                              </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                              <div>{ReactHtmlParser(
                                      userLang == "EN"
                                        ? allFAQ.AnswerEN
                                        : allFAQ.AnswerFR
                                    )}</div>
                            </AccordionItemPanel>
                          </AccordionItem>
                           ))}

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
