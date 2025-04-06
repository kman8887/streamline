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
      rating: [0, Validators.required],
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
      console.log(createEditData);
      this.onSubmit.emit(createEditData);
      this.visible = false;
    }
  }

  close() {
    this.form.reset({ rating: 0, text: '' });

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
