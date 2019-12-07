import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

export interface DialogData {
  type: string;
  element: any;
}

export interface DialogDataConfirm {
  title: string;
  action: string;
  element: any;
}

export interface Data {
  seq: number;
  title: string;
  description: string;
  dateCreate: string;
}

const mock: Data[] = [
  {seq: 1, title: 'Hydrogen  eowjejwkjekwjekjwkjeklwheklwjkejkjkjekwjekwjekj', description: 'kjsjdksjdkskdjks', dateCreate: '05/12/2019 22:54:55'},
  {seq: 2, title: 'teste', description: 'kjsjdksjdkskdjks', dateCreate: '05/12/2019 22:54:55'},
  {seq: 3, title: 'coco', description: 'kjsjdksjdkskdjks', dateCreate: '05/12/2019 22:54:55'},
  {seq: 4, title: 'pinto', description: 'kjsjdksjdkskdjks', dateCreate: '05/12/2019 22:54:55'},
];


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {


  displayedColumns: string[] = ['seq', 'title', 'dateCreate', 'edit', 'delete'];
  dataSource = mock;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  newTask(): void {
    const data: Data = {seq: 0, title: '', description: '', dateCreate: ''};

    const dialogRef = this.dialog.open(DialogTask, {
      width: '80%', height: '80%',
      data: {type: 'new', element: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  editTask(data: any): void {
    const dialogRef = this.dialog.open(DialogTask, {
      width: '80%', height: '80%',
      data: {type: 'edit', element: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  deleteTask(data: any): void {
    const dialogRef = this.dialog.open(DialogConfirm, {
      width: '400px', height: '200px',
      data: {title: `Deseja realmente deletar a tarefa: ${data.title} ?`, action: 'Deletar', element: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}








/* Dialog Tarefa */
@Component({
  selector: 'dialog-task',
  templateUrl: 'dialog-task.html',
  styleUrls: ['./task-list.component.css']
})
export class DialogTask {
  registerForm: FormGroup;
  type: string;

  constructor(
    public dialogRef: MatDialogRef<DialogTask>, @Inject(MAT_DIALOG_DATA) public data: DialogData,  private formBuilder: FormBuilder) {
      this.registerForm = this.formBuilder.group({
        title: [data.element.title],
        description: [data.element.description]
      });

      switch (data.type) {
        case 'edit':
          this.type = 'Editar Tarefa';
          break;
        default:
          this.type = 'Nova Tarefa';
          break;
      }

    }

  cancel(): void {
    this.dialogRef.close();
  }
  save(): void {
    this.dialogRef.close();
  }

}


/* Dialog Confirm */
@Component({
  selector: 'dialog-confirm',
  templateUrl: 'dialog-confirm.html',
  styleUrls: ['./task-list.component.css']
})
export class DialogConfirm {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirm>, @Inject(MAT_DIALOG_DATA) public data: DialogDataConfirm) {}

  cancel(): void {
    this.dialogRef.close();
  }
  confirm(): void {
    this.dialogRef.close();
  }
}
