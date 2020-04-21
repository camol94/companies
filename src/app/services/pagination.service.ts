import { Injectable } from '@angular/core';
import { range } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  getPager(totalItems: number, currentPage: 1, pageSize: number) {

    const totalPages = Math.ceil(totalItems / pageSize);
    const pagesList = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesList.push(i);
    }

    return {
      totalItems,
      totalPages,
      pagesList
    };
  }


}
