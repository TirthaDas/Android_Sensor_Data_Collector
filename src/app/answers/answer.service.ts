import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AnswerService {
    private Answers: any = [];
    private answerDataUpdated = new Subject<{Answers:any,AnswersCount:number,message:string}>()

    constructor(private http: HttpClient,public router: Router,private _snackBar: MatSnackBar){}

    fetchAnswerData(postsPerPage, currentPage,id: string){

    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.http.get<{ message: string, Answers: any, AnswersCount: number }>('http://localhost:3000/api/getQuestionAnswers/'+ id + queryParams)
      .pipe(map((answerdata) => {
        console.log('seee',answerdata)  
        return {
            Answers: answerdata.Answers.map(data => {
            return {
              id: data._id,
              answer: data.answer,
              userId: data.userId,
              projectId:data.projectId,
              questionId:data.questionId

            };
          }),
          AnswersCount: answerdata.AnswersCount,
          message:answerdata.message
          
        }
      }))
      .subscribe(transformedsensorData => {
        console.log('tra',transformedsensorData)
        this.Answers = transformedsensorData.Answers;
        
        this.answerDataUpdated.next({
            Answers:[...this.Answers],
            AnswersCount:transformedsensorData.AnswersCount,
            message:transformedsensorData.message
            

        });
      }
    ,(err)=>{
        console.log('what is the error',err)
        if(err.error.message==="not authorized"){
            this.answerDataUpdated.next({
                Answers:[...this.Answers],
                AnswersCount:0,
                message:"not authorized"
                
    
            });
        }
    }
      )

    }

    getPostUpdateListener() {
        return this.answerDataUpdated.asObservable()
      }


      openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
          duration: 2000,
        });
      }
}
