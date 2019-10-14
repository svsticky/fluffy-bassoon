import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class StockResolver implements Resolve<any> {

  constructor(private http: HttpClient) { }

  resolve() {
    return this.http.get('http://localhost:8901/stock', { withCredentials: true }).pipe(map(result => {
      return result;
    }));
  }
}
