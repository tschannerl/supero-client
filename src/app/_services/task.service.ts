import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../_models/task';
import { environment } from '../../environments/environment';
import { throwError, Observable } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  // envio rest de post de tarefa
  saveTask(task: Task) {
    const params = new FormData();

    params.append('title', task.title);
    params.append('description', task.description);

    return this.http.post(`${environment.serverUrl}/task/`, params).pipe(
      catchError(this.handleError)
    );
  }

  // envio rest de put de tarefa
  updateTask(task: Task) {
    const params = new FormData();

    params.append('id', task.id.toString());
    params.append('title', task.title);
    params.append('description', task.description);

    return this.http.put(`${environment.serverUrl}/task/`, params).pipe(
      catchError(this.handleError)
    );
  }

  updateStatusTask(task: Task, status: string) {
    const params = new FormData();

    params.append('id', task.id.toString());
    params.append('status', status);

    return this.http.put(`${environment.serverUrl}/task/status`, params).pipe(
      catchError(this.handleError)
    );
  }

  // envio rest de delete de tarefa
  deleteTask(task: Task) {

  }

  // get rest de todas as tarefas
  getAllTasks(): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/task`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // tratamento de erro rest
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }
}
