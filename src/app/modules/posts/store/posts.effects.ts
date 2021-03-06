import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { PopupService, PostsService } from '@core/services';
import { URLS } from '../../../consts';
import * as postsActions from './posts.actions';
import { PostsModuleState } from './posts.reducer';

@Injectable()
export class PostsEffects {
  constructor(
    private postsService: PostsService,
    private popupService: PopupService,
    private store: Store<PostsModuleState>,
    private actions$: Actions,
  ) {}

  loadAllPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postsActions.loadAllPosts),
      switchMap((action) =>
        this.postsService.loadAllPosts(action.url ? action.url : URLS.allPosts).pipe(
          map((res) => {
            return postsActions.loadAllPostsSuccess({ posts: res });
          }),
          catchError(() => {
            this.popupService.error('Błąd ładowania postów');
            return of(postsActions.loadAllPostsFail());
          }),
        ),
      ),
    ),
  );

  loadSinglePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postsActions.loadPost),
      switchMap((action) =>
        this.postsService.getSinglePost(action.id).pipe(
          map((res) => postsActions.loadPostSuccess({ post: res })),
          catchError(() => {
            this.popupService.error('Błąd ładowania posta');
            return of(postsActions.loadPostFail());
          }),
        ),
      ),
    ),
  );

  loadComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postsActions.loadComments),
      switchMap((action) =>
        this.postsService.getComments(action.url ? action.url : URLS.commentsGet + action.id + '/').pipe(
          map((res) => postsActions.loadCommentsSuccess({ comments: res })),
          catchError(() => {
            this.popupService.error('Błąd ładowania komentarzy');
            return of(postsActions.loadCommentsFail());
          }),
        ),
      ),
    ),
  );

  editComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postsActions.editComment),
      switchMap((action) =>
        this.postsService.editComment(action.comment, action.id).pipe(
          map(() => {
            this.store.dispatch(action.refreshAction);
            return postsActions.editCommentSuccess();
          }),
          catchError(() => {
            this.popupService.error('Błąd edycji komentarza');
            return of(postsActions.editCommentFail());
          }),
        ),
      ),
    ),
  );

  deleteComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postsActions.deleteComment),
      switchMap((action) =>
        this.postsService.deleteComment(action.id).pipe(
          map(() => {
            this.store.dispatch(action.refreshAction);
            return postsActions.deleteCommentSuccess();
          }),
          catchError(() => {
            this.popupService.error('Błąd usuwania posta');
            return of(postsActions.deleteCommentFail());
          }),
        ),
      ),
    ),
  );

  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postsActions.addComment),
      switchMap((action) =>
        this.postsService.addComment(action.comment, action.postId).pipe(
          map((res) => {
            this.store.dispatch(action.refreshAction);
            return postsActions.addCommentSuccess();
          }),
          catchError(() => {
            this.popupService.error('Błąd dodawania komentarza');
            return of(postsActions.addCommentFail());
          }),
        ),
      ),
    ),
  );
}
