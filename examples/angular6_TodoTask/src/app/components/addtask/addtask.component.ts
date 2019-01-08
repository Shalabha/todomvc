import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    FormArray,
    Validators
} from '@angular/forms';
import {
    ChangeDetectorRef
} from '@angular/core';
import {
    NgbCalendar,
    NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-addtask',
    templateUrl: './addtask.component.html',
    styleUrls: ['./addtask.component.css']
})
export class AddtaskComponent implements OnInit {
    submitBtnClicked: Boolean = false;
    taskForm: FormGroup;
    rowData: Array < any > = [];

    constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef, private calendar: NgbCalendar) {}

    //Initialize the angular 6 reactive form
    ngOnInit() {
        this.taskForm = this.fb.group({
            task: this.fb.array([
                this.createTaskFormGroup()
            ])
        })
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    //Internal function for the replicating form component
    createTaskFormGroup(): FormGroup {
        return this.fb.group({
            taskId: ['', Validators.required],
            taskName: ['', Validators.required],
            durationDate: ['', Validators.required],
            priority: ['', Validators.required]
        })
    }
    getTaskList(form){
      return form.get('task').controls;
    }

    //function on clicking add task icon
    addTask() {
         this.submitBtnClicked = false;
        (< FormArray > this.taskForm.get("task")).push(this.createTaskFormGroup());
    }

    //function to format the duedate as 'yyyy-mm-dd'
    getDueDate(date) {
        return date ? date['year'] + '-' + date['month'] + '-' + date['day'] : '';
    }

    //function to add custom class to identify if the duedates exceeded or nearer etc
    addCustomClassBasedOnDueDate(date) {
        let dueDate = date['year'] + '-' + date['month'] + '-' + date['day'];
        let today = new Date();
        let d2 = new Date(dueDate);
        let timeDiff = Math.abs(today.getTime() - d2.getTime());
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (today > d2) {
            return 'high-dueDate'
        } else if (d2 > today && diffDays <= 3) {
            return 'low-dueDate'
        } else if(today < d2){
          return 'no-duedate'
        }
    }
    // function on clicking the form submit
    onSubmit() {
        if (this.taskForm.get('task').status === 'VALID') {
          this.rowData = [];
            this.submitBtnClicked = true;
            let item = this.taskForm['value']['task'];
            item.forEach((e) => {
                this.rowData.push({
                    taskId: e['taskId'],
                    taskName: e.taskName,
                    durationDate: e.durationDate,
                    priority: e.priority
                });
            })
        } else {
            this.validateFormFields(this.taskForm)
        }
    }

    //internal fn to trigger the validation upon form submit, if form is invalid
    validateFormFields(form: FormGroup) {
        Object.keys(form.controls).forEach(field => { //{2}
            const control = form.get(field); //{3}
            if (control instanceof FormControl) { //{4}
                control.markAsTouched({
                    onlySelf: true
                });
            } else if (control instanceof FormArray) {
                console.log(control)
                control.controls.forEach((elem) => {
                    if (elem instanceof FormGroup) {
                        this.validateFormFields(elem);
                    }
                })
            }
        });
    }
}