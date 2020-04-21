import {Component, OnInit} from '@angular/core';
import {AppService} from './services/app.service';
import { Company } from './models/app.model';
import { PaginationService} from './services/pagination.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private appService: AppService, private paginationService: PaginationService) {}

  tableHead = [
    {
      id: 'id',
      name: 'ID',
      sort: 'number'
    },
    {
      id: 'name',
      name: 'Name',
      sort: 'string'
    },
    {
      id: 'city',
      name: 'City',
      sort: 'string'
    },
    {
      id: 'totalIncome',
      name: 'Total Income',
      sort: 'number'
    },
    {
      id: 'averageIncome',
      name: 'Average Income',
      sort: 'number'
    },
    {
      id: 'lastIncome',
      name: 'Last Month Income',
      sort: 'number'
    }
  ];
  sorting = 'ASC';
  _searchValue;

  itemsPerPage = 10;
  pages;
  pager;
  pageValue = 1;
  startItems = 0;
  endItems = this.itemsPerPage;
  companies: Company[];
  companiesFiltered: Company[];
  ngOnInit() {
    this.getCompanies();
  }

  getIncomes() {
    for (let i = 0; i < this.companies.length; ++i) {
      this.appService.getCompanyIncomes(this.companies[i].id).subscribe(income => {
        this.companies[i].totalIncome = this.countIncome(income.incomes);
        this.companies[i].averageIncome = +this.countAverageIncome(income.incomes);
        this.companies[i].lastIncome = this.countLastMonthIncome(income.incomes);
        this.pages = this.companies.length / this.itemsPerPage;
      });
    }
  }

  getCompanies() {
    this.appService.getCompanies().subscribe( companies => {
      this.companies = companies;
      this.companiesFiltered = companies;
      this.getPager();
      this.getIncomes();
    });
  }

  countIncome(incomes) {
    let totalIncome = 0;
    for (let i = 0; i < incomes.length; i++) {
      totalIncome += parseFloat(incomes[i].value);
    }
    return parseFloat(totalIncome.toFixed(2));
  }

  countAverageIncome(incomes) {
    return parseFloat(String(this.countIncome(incomes) / incomes.length)).toFixed(2);
  }

  countLastMonthIncome(incomes) {
    let lastMonthIncomes = incomes;
    let recentDataNumber = 0;
    lastMonthIncomes.forEach( income => {
      const lastDataNumber = Number(income.date.substr(0, 7).replace('-', ''));
      if (lastDataNumber > recentDataNumber){
        recentDataNumber = lastDataNumber;
      }
    });
    lastMonthIncomes = lastMonthIncomes.filter( income => {
      return recentDataNumber === Number(income.date.substr(0, 7).replace('-', ''));
    });
    return this.countIncome(lastMonthIncomes);
  }

  sortItems(column, sort, order, e) {
    e.target.parentElement.querySelectorAll( 'th').forEach( d =>
      d.classList.remove( 'asc', 'desc' )
    );
    if(order === 'ASC') {
      column.order = 'DESC';
      e.target.classList.add( 'desc' );
      if (sort === 'number') {
        this.companiesFiltered = this.companiesFiltered.sort((a, b) => b[column.id] - a[column.id]);
      } else {
        this.companiesFiltered = this.companiesFiltered.sort((a, b) => a[column.id] < b[column.id] ? 1 : -1);
      }
    } else {
      e.target.classList.add( 'asc' );
      column.order = 'ASC';
      if (sort === 'number') {
        this.companiesFiltered = this.companiesFiltered.sort((a, b) => a[column.id] - b[column.id]);
      } else {
        this.companiesFiltered = this.companiesFiltered.sort((a, b) => a[column.id] > b[column.id] ? 1 : -1);
      }

    }
  }

  filterCompanies(searchValue) {
    return this.companies.filter(el => {
      for (const key in el) {
        if ((el[key].toString().toLowerCase()).includes(searchValue.toLowerCase())) {
          return true;
        }
      }
    });
  }

  getPager() {
    this.pager = this.paginationService.getPager(this.companiesFiltered.length, 1, this.itemsPerPage);
    this.pages = this.pager.totalPages;
    this.startItems = 0;
    this.endItems = this.itemsPerPage;
  }

  changeItemsPerPage() {
    this.getPager();
    this.pageValue = 1;
  }

  changePage(value?) {
    let page;
    if (value === 'next') {
      page = this.pageValue + 1;
    } else if (value === 'prev') {
      page = this.pageValue - 1;
    } else if (value === 'first') {
      page = 1;
    } else if(value === 'last') {
      page = this.pager.totalPages;
    } else {
      page = this.pageValue;
    }
    this.pageValue = page;
    this.startItems = this.itemsPerPage * (page - 1);
    this.endItems = this.itemsPerPage * page;
  }

  get searchValue(): string {
    return this._searchValue;
  }

  set searchValue(value) {
    this._searchValue = value;
    this.companiesFiltered = this.filterCompanies(value)
    this.getPager();
    this.pageValue = 1;
  }
}

