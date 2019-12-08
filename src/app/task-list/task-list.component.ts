import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TaskService } from '../_services/task.service';
import { Task } from '../_models/task';

export interface DialogData {
  type: string;
  element: any;
}

export interface DialogDataConfirm {
  title: string;
  action: string;
  element: any;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'title', 'dateCreate', 'status', 'edit', 'delete'];
  public dataSource = null;

  constructor(public dialog: MatDialog, private taskService: TaskService) { }

  ngOnInit() {
    this.findAllTask();
  }

  // buscando todas as tarefas
  findAllTask() {
    this.taskService.getAllTasks().pipe().subscribe(
      data => {
        this.dataSource = data;
      }
    );
  }

  // abrindo dialog para nova tarefa
  newTask(): void {
    const data: Task = {id: 0, title: '', description: '', dtCreate: '', dtUpdate: '', dtConclusion: '', status: ''};

    const dialogRef = this.dialog.open(DialogTask, {
      width: '80%', height: '80%',
      data: {type: 'new', element: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.findAllTask();
    });
  }

  // abrindo dialog para editar a tarefa
  editTask(data: any): void {
    const dialogRef = this.dialog.open(DialogTask, {
      width: '80%', height: '80%',
      data: {type: 'edit', element: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.findAllTask();
    });
  }

  // abrindo dialog para confirmar a exclusão de uma tarefa
  deleteTask(data: any): void {
    const dialogRef = this.dialog.open(DialogConfirm, {
      width: '400px', height: '200px',
      data: {title: `Deseja realmente deletar a tarefa: ${data.title} ?`, action: 'Deletar', element: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  changeStatus(event: any, element: any) {
    let status = 'false';

    if (event.checked) {
      status = 'true';
    }
    const task: Task = element;
    this.taskService.updateStatusTask(task, status).pipe().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log('error : ' + error);
        // this.toastr.error('Erro ao realizar o registro, provável existência do cliente', 'Cadastro');
      }
    );
  }
}








/* ############ Dialog Tarefa ##############*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-task',
  templateUrl: 'dialog-task.html',
  styleUrls: ['./task-list.component.css']
})
// tslint:disable-next-line:component-class-suffix
export class DialogTask {
  registerForm: FormGroup;
  type: string;

  constructor(
    public dialogRef: MatDialogRef<DialogTask>, @Inject(MAT_DIALOG_DATA) public data: DialogData,  private formBuilder: FormBuilder, private taskService: TaskService) {
      this.registerForm = this.formBuilder.group({
        title: [data.element.title],
        description: [data.element.description]
      });

      // identificador do tipo do dialog
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

  // clicik de salvar/atualizar tarefa
  save(): void {
    if (this.data.type === 'new') { // caso o tipo seja nova tarefa envia post
      const task: Task = {} as any;

      task.title = this.registerForm.controls.title.value;
      task.description = this.registerForm.controls.description.value;

      this.taskService.saveTask(task).pipe().subscribe(
        data => {
          console.log(data);
          this.dialogRef.close();
        },
        error => {
          console.log('error : ' + error);
          // this.toastr.error('Erro ao realizar o registro, provável existência do cliente', 'Cadastro');
        }
      );
    } else if (this.data.type === 'edit') { // caso o tipo seja editar tarefa envia put
      const task: Task = this.data.element;

      task.title = this.registerForm.controls.title.value;
      task.description = this.registerForm.controls.description.value;

      this.taskService.updateTask(task).pipe().subscribe(
        data => {
          console.log(data);
          this.dialogRef.close();
        },
        error => {
          console.log('error : ' + error);
          // this.toastr.error('Erro ao realizar o registro, provável existência do cliente', 'Cadastro');
        }
      );
    }
  }
}


/* ############ Dialog Confirm ##############*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-confirm',
  templateUrl: 'dialog-confirm.html',
  styleUrls: ['./task-list.component.css']
})
// tslint:disable-next-line:component-class-suffix
export class DialogConfirm {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirm>, @Inject(MAT_DIALOG_DATA) public data: DialogDataConfirm) {}

    // cancela exclusão
  cancel(): void {
    this.dialogRef.close();
  }

  // confirma a exclusão
  confirm(): void {
    this.dialogRef.close();
  }
}
