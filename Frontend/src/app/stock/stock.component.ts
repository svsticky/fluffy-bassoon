import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditStockComponent } from './edit-stock/edit-stock.component';
import { StockData } from '../../interfaces/product.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})

export class StockComponent implements OnInit {

  stockData: StockData;

  constructor(private activatedRoute: ActivatedRoute, public dialog: MatDialog, private http: HttpClient, private router: Router) {
    this.stockData = this.activatedRoute.snapshot.data.stocks;
  }

  editWindow(i) {
    const editStock = this.dialog.open(EditStockComponent, {
      width: '350px',
      data: this.stockData[i]
    });

    editStock.afterClosed().subscribe(data => {
      if (data !== undefined && data !== '') {
        this.http.post('http://localhost:8901/product/update', data)
          .pipe()
          .subscribe(() => {
            // Update data
          });
      }
    });
  }

  ngOnInit() {
  }

}
