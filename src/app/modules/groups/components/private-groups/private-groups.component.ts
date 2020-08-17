import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ROUTES } from '@core/consts';
import { IGroup, IRoutes } from '@core/interfaces';
import { selectGroupCreationFormVisibility, selectPrivateGroups, selectPrivateGroupsLoading, GroupsModuleState } from '../../store';
import * as groupsActions from '../../store/groups.actions';

@Component({
  selector: 'app-private-groups',
  templateUrl: './private-groups.component.html',
  styleUrls: ['./private-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('appear', [
      transition('void => *', [style({ opacity: 0 }), animate(300, style({ opacity: 1 }))]),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class PrivateGroupsComponent implements OnDestroy {
  groups: IGroup[];
  next: string;
  groupsLoading$: Observable<boolean>;
  sub$: Subscription;
  groupCreationFormVisible: Observable<boolean>;

  constructor(private store: Store<GroupsModuleState>, private cdRef: ChangeDetectorRef) {
    this.groups = [];
    this.sub$ = new Subscription();
    this.store.dispatch(groupsActions.loadPrivateGroups({ url: null }));
    const groups$ = this.store
      .select(selectPrivateGroups)
      .pipe(filter((res) => res !== null))
      .subscribe((resGroups) => {
        this.groups = resGroups.groups;
        this.next = resGroups.next;
        this.cdRef.markForCheck();
      });
    this.groupsLoading$ = this.store.select(selectPrivateGroupsLoading);
    this.groupCreationFormVisible = this.store.select(selectGroupCreationFormVisibility);
    this.sub$.add(groups$);
  }

  get routes(): IRoutes {
    return ROUTES;
  }

  @HostListener('window:scroll') scroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (this.next !== null) {
        this.store.dispatch(groupsActions.loadPrivateGroups({ url: this.next }));
      }
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  revealGroupCreationForm() {
    this.store.dispatch(groupsActions.showGroupCreationForm());
  }
}
