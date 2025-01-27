export interface User {
  _id: string;
  username: string;
  totalProducts: number;
  totalReviews: number;
  totalFoundFunny: number;
  totalFoundHelpful: number;
  totalFoundNotHelpful: number;
  avatar: string;
  timecreated: Date;
  auth_id: string;
  realname: string;
  loccountrycode: string;
}
