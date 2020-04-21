import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

const COMPANIES_URL = 'companies';
const INCOMES_URL = 'incomes';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<any> {
    return this.http.get(`${environment.API_URL}${COMPANIES_URL}`);
  }

  getCompanyIncomes(id): Observable<any> {
    return this.http.get(`${environment.API_URL}${INCOMES_URL}/${id}`);
  }
}
