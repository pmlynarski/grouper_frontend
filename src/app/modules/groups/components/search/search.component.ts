import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DialogService } from '@core/services';
import { ROUTES } from '../../../../consts';
import { IGroup } from '../../../../interfaces';
import { selectJoiningGroup, selectSearchingForGroup, selectSearchingResults, GroupsModuleState } from '../../store';
import * as groupsActions from '../../store/groups.actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnDestroy {
  private sub$: Subscription;
  searchForm: FormGroup;
  results: IGroup[];
  next: string;
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<GroupsModuleState>,
    private dialogService: DialogService,
  ) {
    this.sub$ = new Subscription();
    this.searchForm = new FormGroup({
      phrase: new FormControl(null, Validators.required),
    });
    this.loading = false;
    const route$ = this.route.params.subscribe((param) => {
      const phrase = param.phrase;
      if (phrase.length > 0) {
        this.phrase.setValue(phrase);
        this.store.dispatch(groupsActions.searchForGroup({ phrase, url: null }));
      } else {
        this.store.dispatch(groupsActions.clearResults());
      }
    });
    const results$ = this.store
      .select(selectSearchingResults)
      .pipe(filter((res) => res !== null))
      .subscribe((respGroups) => {
        this.results = respGroups.groups;
        this.next = respGroups.next;
      });
    const loading$ = this.store.select(selectSearchingForGroup).subscribe((res) => {
      res ? this.searchForm.disable() : this.searchForm.enable();
      this.loading = res;
    });
    this.sub$.add(route$);
    this.sub$.add(results$);
    this.sub$.add(loading$);
  }

  get phrase() {
    return this.searchForm.get('phrase');
  }

  search() {
    if (this.phrase.value) {
      this.router.navigate([ROUTES.search.path + this.phrase.value]);
    }
  }

  joinGroup(group: IGroup) {
    this.dialogService.showDialog({
      header: 'Dołączanie do grupy',
      caption: 'Jesteś pewien?',
      onAcceptCallback: () => {
        this.store.dispatch(groupsActions.joinGroup({ groupId: group.id }));
      },
      loadingSelect: this.store.select(selectJoiningGroup),
    });
  }

  handleResultsScroll() {
    if (this.next !== null && !this.loading) {
      this.store.dispatch(groupsActions.searchForGroup({ phrase: undefined, url: this.next }));
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }
}
