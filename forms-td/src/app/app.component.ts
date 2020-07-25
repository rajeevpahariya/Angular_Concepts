import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('f', { static: false }) signupForm: NgForm;
  defaultQuestion = 'teacher';
  answer = '';
  genders = ['male', 'female'];
  user = {
    username: '',
    email: '',
    secretQuestion: '',
    answer: '',
    gender: ''
  };
  submitted = false;

  suggestUserName() {
    const suggestedName = 'Superuser';
    // This is not right approach as its override all the value of form
    // this.signupForm.setValue({
    //   userData: {
    //     username: suggestedName,
    //     email:''
    //   },
    //   secret: 'pet',
    //   questionAnswer:'',
    //   gender:'male'
    // });

    // Use form object
    this.signupForm.form.patchValue({
      userData:{
        username:suggestedName
      }
    });
  }

  onSubmit(form : NgForm){
    //console.log(form);
    //console.log(form.value.userData.username);
    //console.log(form.value.userData.email);
    //console.log(form.value['secret']);
    this.submitted = true;
    this.user.username = this.signupForm.value.userData.username;
    this.user.email = this.signupForm.value.userData.email;
    this.user.secretQuestion = this.signupForm.value.secret;
    this.user.answer = this.signupForm.value.questionAnswer;
    this.user.gender = this.signupForm.value.gender;

    this.signupForm.reset();
  }

  // View Chind Approach
  onSubmitViewChildApproach(){
    console.log(this.signupForm);
  }
}
