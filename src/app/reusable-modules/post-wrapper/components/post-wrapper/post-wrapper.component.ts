import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPost } from '@core/interfaces';

@Component({
  selector: 'app-post-wrapper',
  templateUrl: './post-wrapper.component.html',
  styleUrls: ['./post-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostWrapperComponent implements OnInit {
  @Input() post: IPost;
  @Input() isOwnerOrAdmin: boolean;
  @Input() postLoading: boolean;
  @Output() sendUpdate: EventEmitter<{ id: number; data: FormData }>;
  dropdownVisible: boolean;
  editForm: FormGroup;
  formVisibility: boolean;
  image: File;
  file: File;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.sendUpdate = new EventEmitter<{ id: number; data: FormData }>();
    this.dropdownVisible = false;
  }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      content: new FormControl(this.post.content, Validators.required),
    });
  }

  dropdownReveal(event) {
    event.stopPropagation();
    this.dropdownVisible = true;
  }

  @HostListener('window:click', ['$event']) hideDropdown(event) {
    const dropdown = this.document.querySelector('.dropdown');
    if (this.dropdownVisible && event.target !== dropdown) {
      this.dropdownVisible = false;
    }
  }

  hoverOption(event) {
    event.target.classList.add('u-item--hover');
  }

  unHoverOption(event) {
    event.target.classList.remove('u-item--hover');
  }

  editButton(event) {
    this.formVisibility = true;
  }

  deleteButton(event) {
    event.stopPropagation();
  }

  hideForm() {
    this.formVisibility = false;
    this.editForm.get('content').setValue(this.post.content);
  }

  chooseImage() {
    const input = this.document.querySelector('.image__input');
    input.dispatchEvent(new MouseEvent('click'));
  }

  chooseFile() {
    const input = this.document.querySelector('.file__input');
    input.dispatchEvent(new MouseEvent('click'));
  }

  get content() {
    return this.editForm.get('content');
  }

  get data(): FormData {
    const fd = new FormData();
    fd.append('content', this.content.value);
    if (this.image) {
      fd.append('image', this.image);
    }
    if (this.file) {
      fd.append('file', this.file);
    }
    return fd;
  }

  updatePost() {
    this.sendUpdate.emit({ id: this.post.id, data: this.data });
  }

  imageChange($event) {
    this.image = $event.target.files[0];
  }

  fileChange($event) {
    this.file = $event.target.files[0];
  }
}