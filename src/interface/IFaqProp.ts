export interface IFaqProp {
  Id?: number;
  QuestionEN?: string;
  QuestionFR?: string;
  AnswerEN?: string;
  AnswerFR?: string;
  BusinessCategory?: string;
  CategoryNameEN?: string;
  CategoryNameFR?: string;
  CategorySortOrder?: number;
  QuestionSortOrder?: number;
  IsFullRow?: string;
  expandRow?: boolean;
  Modified?: Date;
}
