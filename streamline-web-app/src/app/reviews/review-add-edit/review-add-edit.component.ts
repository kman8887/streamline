import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { createEditReview } from '../../models/createEditReview';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface editReview {
  text: string;
  rating: number;
}

@Component({
  selector: 'app-review-add-edit',
  templateUrl: './review-add-edit.component.html',
  styleUrl: './review-add-edit.component.scss',
})
export class ReviewAddEditComponent implements OnInit {
  form!: FormGroup;

  @Input()
  formData: editReview | undefined;
  @Input({ required: true }) id!: string;
  @Output() onSubmit = new EventEmitter();

  visible: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.createNewForm();
  }

  createNewForm() {
    this.form = this.formBuilder.group({
      rating: [null, Validators.required],
      text: ['', Validators.required],
    });

    // Edit Mode will have formData.
    if (this.formData) {
      this.form.patchValue(this.formData);
    }
  }

  submit(form: FormGroup) {
    if (form.valid) {
      let createEditData: createEditReview = {
        ...form.value,
        id: this.id,
      };
      this.onSubmit.emit(createEditData);
      this.visible = false;
    }
  }

  close() {
    this.form.reset({ rating: null, text: '' });

    if (this.formData) {
      this.form.patchValue(this.formData);
    }
  }

  showDialog() {
    this.visible = true;
  }

  getLabel(): string {
    return this.formData ? 'Edit Review' : 'Write Review';
  }
}
