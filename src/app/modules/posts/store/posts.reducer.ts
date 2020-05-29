import { createReducer, on, Action } from '@ngrx/store';

import { IResponsePosts } from '@core/interfaces';
import * as postsActions from '../store/posts.actions';

export interface PostModuleState {
  posts: PostState;
}

export interface PostState {
  allPostsLoading: boolean;
  allPosts: IResponsePosts;
}

export const initialState: PostState = {
  allPostsLoading: false,
  allPosts: {
    next: null,
    posts: null,
  },
};

export const POSTS_REDUCER = createReducer(
  initialState,
  on(postsActions.loadAllPosts, (state) => ({ ...state, allPostsLoading: true })),
  on(postsActions.loadAllPostsSuccess, (state, { posts }) => ({
    ...state,
    allPostsLoading: false,
    allPosts: state.allPosts ? posts : { next: posts.next, posts: [...state.allPosts.posts, ...posts.posts] },
  })),
  on(postsActions.loadAllPostsFail, (state) => ({ ...state, allPostsLoading: false })),
);

export function postsReducer(state: PostState | undefined, action: Action) {
  return POSTS_REDUCER(state, action);
}