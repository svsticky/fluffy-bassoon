import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material';
import { StockData } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-edit-stock',
  templateUrl: './edit-stock.component.html',
  styleUrls: ['./edit-stock.component.scss']
})
export class EditStockComponent implements OnInit {

  stockData: StockData;
  updateForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public product: any, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) {
    this.stockData = this.activatedRoute.snapshot.data.stocks;
    this.updateForm = this.formBuilder.group({
      amount_available: product.amount_available
    });
  }

  ngOnInit() {
  }
}
