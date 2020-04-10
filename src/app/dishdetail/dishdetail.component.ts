import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';

import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService} from '../services/dish.service';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;  
  
  errMess: string;

  commentForm: FormGroup;
  comment: Comment;
  dishCopy: Dish;
  visibility = 'shown';
  // date = Date.now();
  
  @ViewChild('cform') commentFormDirective;
  
  formErrors = {
    'author' : '',
    'rating' : '5',
    'comment' : '',
    'date' : ''
  };

  validationMessages = {
    'author' : {
      'required' : 'Name is required',
      'minlength' : 'Name must be at least 2 characters long',
      'maxlength' : 'Name cannot be more than 25 characters'
    },
    'comment' : {
      'required' : 'Comment is requird',
      'minlength' : 'Comment must be at least 2 characters long',
      'maxlength' : 'Comment cannot be more than 200 characters'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private dishService: DishService,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL
  ) { 
    this.createForm();
  }

  
  ngOnInit(): void {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    // this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    // .subscribe(
    //   dish => { this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); },
    //   errmess => this.errMess = <any>errmess
    //   );
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack() {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: '5',
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      date: Date.now()
    });
    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dishCopy.comments.push(this.comment);
    this.dishService.putDish(this.dishCopy)
      .subscribe(dish => {
        this.dish = dish;
        this.dishCopy = dish;
      },
      errmess => {
        this.dish = null;
        this.dishCopy = null;
        this.errMess = <any>errmess;
      }
      );
    this.commentFormDirective.resetForm(); 
    this.commentForm.reset({
          author: '',
          rating: 5,
          comment: '',
        });
  }

}
