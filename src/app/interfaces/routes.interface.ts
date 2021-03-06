export interface IRoutes {
  login: IRoute;
  register: IRoute;
  home: IRoute;
  posts: IRoute;
  allPosts: IRoute;
  singlePost: IRoute;
  groupsModule: IRoute;
  privateGroups: IRoute;
  singleGroup: IRoute;
  error403: IRoute;
  search: IRoute;
  profile: IRoute;
  chatModule: IRoute;
  singleChat: IRoute;
  adminModule: IRoute;
  usersList: IRoute;
}

export interface IRoute {
  name: string;
  path: string;
}
