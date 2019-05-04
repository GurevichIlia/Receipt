import { Component, OnInit, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ReceiptsService } from '../../services/receipts.service';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { Product } from 'src/app/models/product.model';
import { NgForm } from '@angular/forms';
import { MatTable, MatSelectChange, MatDialog } from '@angular/material';
import { CreditCardComponent } from '../credit-card/credit-card.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  @Output() selectionChange: EventEmitter<MatSelectChange>;
  @ViewChild('table') table: MatTable<Product>;
  @ViewChild('myForm') form: NgForm;
  payByCreditCard: boolean;
  arrayOfNumbers = Array.from(Array(100).keys());
  product: Product;
  productsData: any[];
  productCategories: object[];
  productsName: object[];
  displayedColumns = ['name', 'amount', 'price', 'total', 'delete'];
  addedProdToORder: Product[] = [];
  totalPriceForOrder: number;
  totalPriceForProduct: number;
  orderedProducts: Product[] = [];
  productAmount: number;
  constructor(
    private receitService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog
  ) {
    this.product = {
      prodId: null,
      prodCatName: null,
      prodName: '',
      prodPrice: null,
      prodAmount: null,
      totalPrice: null,
    };
  }

  ngOnInit() {
    this.getProductData();
    this.receitService.payTypeCreditCard.subscribe(data => {
      this.payByCreditCard = data;
      console.log(data)
    })
  }

  getProductData() {
    this.generalService.getProductsData().subscribe(data => {
      this.productsData = data;
      this.productCategories = data.ProductCategories;
      this.productsName = data.Products;
      console.log(this.productsData);
    }, err => console.log(err));
  }
  getSelectedProd(prod) {
    this.product.prodPrice = prod.Price;
    this.product.prodAmount = 1;
    this.product.prodId = prod.ProductId;
    this.totalPriceForProd();
    console.log(prod);
  }
  addProdToList(prod: NgForm) {
    if (prod.value.prodName === null && prod.value.prodAmount === null) {
      alert('Select product');
    } else {
      this.totalPriceForProd();
      console.log('this.product', prod.value);
      if (this.addedProdToORder.length != 0) {
        if (this.checkSameProdInList(prod, this.addedProdToORder) === 1) {
          this.showTotalPriceForOrder();
          console.log('this.addedProdToORder', this.addedProdToORder);
          this.form.reset();
        } else {
          this.addedProdToORder.push(prod.value);
          this.showTotalPriceForOrder();
          console.log('this.addedProdToORder', this.addedProdToORder);
          this.form.reset();
        }
      } else {
        this.addedProdToORder.push(prod.value);
        this.showTotalPriceForOrder();
        console.log('this.addedProdToORder', this.addedProdToORder);
        this.form.reset();
      }
    }



  }
  checkSameProdInList(newProd: NgForm, list: Product[]) {
    let newProduct: number;
    for (const prod of list) {
      if (prod.prodId === newProd.value.prodId) {
        prod.prodAmount = prod.prodAmount + newProd.value.prodAmount;
        prod.totalPrice = prod.prodPrice * prod.prodAmount;
        newProduct = 1;
      } else {
      }
    }
    return newProduct;
  }
  showTotalPriceForOrder() {
    let totalPrice = 0;
    for (const price of this.addedProdToORder) {
      totalPrice += price.totalPrice;
    }
    this.totalPriceForOrder = totalPrice;
  }
  totalPriceForProd() {
    this.totalPriceForProduct = this.product.prodPrice * this.product.prodAmount;
    this.product.totalPrice = this.totalPriceForProduct;
    console.log(this.product.totalPrice);
  }
  changeAmountInList(product, amount) {
    product.totalPrice = product.prodPrice * +amount;
    this.showTotalPriceForOrder();
    console.log(product, amount, product.totalPrice);
  }
  deleteProduct(productId: number) {
    if (confirm('Are you sure to delete?')) {
      this.addedProdToORder = this.addedProdToORder.filter(data => data.prodId != productId);
      this.showTotalPriceForOrder();
    }
  }
  backToPayment() {
    if (this.payByCreditCard) {
      this.dialog.open(CreditCardComponent, { width: '350px' });
      this.receitService.setStep(2);
    } else {
      this.receitService.setStep(2);
      this.receitService.prevStep();
    }
  }
}
