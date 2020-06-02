import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { IGroup } from '@core/interfaces';

@Component({
  selector: 'app-group-wrapper',
  templateUrl: './group-wrapper.component.html',
  styleUrls: ['./group-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupWrapperComponent implements OnInit {
  @Input() group: IGroup;

  constructor() {}

  ngOnInit(): void {}
}