import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TaskService } from '../_services/task.service';
import { Task } from '../_models/task';
import { ToastrService } from 'ngx-toastr';

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
  public displayedColumns: string[] = ['id', 'title', 'dateCreate', 'dateUpdate', 'dateCompleted', 'status', 'edit', 'delete'];
  public dataSource = null;

  constructor(public dialog: MatDialog, private taskService: TaskService, private toastr: ToastrService) { }

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
      data: {type: 'new', return: '', element: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.toastr.success('Tarefa inserida com sucesso!!!', 'Nova Tarefa');
      } else if (result === 'error') {
        this.toastr.error('Problema ao inserir nova tarefa', 'Nova Tarefa');
      }
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
      if (result === 'ok') {
        this.toastr.success('Tarefa editada com sucesso!!!', 'Edição Tarefa');
      } else if (result === 'error') {
        this.toastr.error('Problema ao editar tarefa', 'Edição Tarefa');
      }
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
      if (result === 'ok') {
        this.toastr.success('Tarefa deletada com sucesso!!!', 'Deletar Tarefa');
      } else if (result === 'error') {
        this.toastr.error('Problema ao deletar tarefa', 'Deletar Tarefa');
      }
      this.findAllTask();
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
        this.toastr.success('Tarefa com status atulizado!!!', 'Atualizar Tarefa');
        this.findAllTask();
      },
      error => {
        this.toastr.error('Problema ao atualizar status da tarefa', 'Atualizar Tarefa');
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
          this.dialogRef.close('ok');
        },
        error => {
          this.dialogRef.close('error');
        }
      );
    } else if (this.data.type === 'edit') { // caso o tipo seja editar tarefa envia put
      const task: Task = this.data.element;

      task.title = this.registerForm.controls.title.value;
      task.description = this.registerForm.controls.description.value;

      this.taskService.updateTask(task).pipe().subscribe(
        data => {
          this.dialogRef.close('ok');
        },
        error => {
          this.dialogRef.close('error');
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
    public dialogRef: MatDialogRef<DialogConfirm>, @Inject(MAT_DIALOG_DATA) public data: DialogDataConfirm, private taskService: TaskService) {}

    // cancela exclusão
  cancel(): void {
    this.dialogRef.close();
  }

  // confirma a exclusão
  confirm(): void {
    const task: Task = this.data.element;

    this.taskService.deleteTask(task).pipe().subscribe(
      data => {
        this.dialogRef.close('ok');
      },
      error => {
        this.dialogRef.close('error');
      }
    );

    this.dialogRef.close();
  }
}
