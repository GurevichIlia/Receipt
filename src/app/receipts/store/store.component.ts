import { Component, OnInit, ChangeDetectorRef, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ReceiptsService } from '../../services/receipts.service';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { Product } from 'src/app/models/products.model';
import { NgForm } from '@angular/forms';
import { MatTable, MatSelectChange, MatDialog } from '@angular/material';
import { CreditCardComponent } from '../credit-card/credit-card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit, OnDestroy {
  @Output() selectionChange: EventEmitter<MatSelectChange>;
  @ViewChild('table') table: MatTable<Product>;
  @ViewChild('myForm') form: NgForm;
  step: number;
  payByCreditCard: boolean;
  arrayOfNumbers = Array.from(Array(100).keys());
  product: Product;
  productsData: any[];
  productCategories: object[];
  productsName: object[];
  displayedColumns = ['name', 'amount', 'price', 'total', 'delete'];
  addedProdToOrder: Product[] = [];
  totalPriceForOrder: number;
  totalPriceForProduct: number;
  orderedProducts: [] = [];
  productAmount: number;
  store: {} = {
    addedProdToORder: [],
  }
  prodCatName;
  currentlyLang: string;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
  ) {
    this.product = {
      discount: null,
      productid: null,
      productName: '',
      pricebyunit: null,
      amount: null,
      totalrow: null,
      totalall: null,
    };
  }
  ngOnInit() {
    this.subscriptions.add(this.generalService.currentlyLang$.subscribe((lang: string) => {
      this.currentlyLang = lang;
    }));
    this.subscriptions.add(this.receiptService.currentlyStep.subscribe(step => this.step = step));
    this.getProductData();
    this.subscriptions.add(this.receiptService.payTypeCreditCard.subscribe(data => {
      this.payByCreditCard = data;
      console.log(data);
    }));
  }
  getProductData() {
    this.subscriptions.add(this.generalService.getProductsData().subscribe(data => {
      this.productsData = data;
      this.productCategories = data.ProductCategories;
      this.productsName = data.Products;
      console.log(this.productsData);
    }, err => console.log(err)));
  }
  getSelectedProd(prod) {
    this.product.pricebyunit = prod.Price;
    this.product.amount = 1;
    this.product.productid = prod.ProductId;
    this.totalPriceForProd();
    console.log(prod);
  }
  addProdToList(prod: NgForm) {
    if (prod.value.productName === null && prod.value.amount === null) {
      alert('Select product');
    } else {
      if (prod.value.amount < 1) {
        alert('Incorrect quantity');
      } else {
        this.totalPriceForProd();
        console.log('this.product', prod.value);
        if (this.receiptService.getProducts().length != 0) {
          if (this.checkSameProdInList(prod, this.receiptService.getProducts()) === 1) {
            this.showTotalPriceForOrder();
            console.log('this.receiptService.getProducts()', this.receiptService.getProducts());
            this.refreshForm();
            console.log(this.form)
          } else {
            this.receiptService.getProducts().push(prod.value);
            this.showTotalPriceForOrder();
            console.log('this.receiptService.getProducts()', this.receiptService.getProducts());
            this.refreshForm();
            console.log(this.form)
          }
        } else {
          this.receiptService.getProducts().push(prod.value);
          this.showTotalPriceForOrder();
          console.log('this.receiptService.getProducts()', this.receiptService.getProducts());
          this.refreshForm();
          console.log(this.form)
        }
      }
    }
  }
  checkSameProdInList(newProd: NgForm, list: Product[]) {
    let newProduct: number;
    for (const prod of list) {
      if (prod.productid === newProd.value.productid) {
        prod.amount = prod.amount + newProd.value.amount;
        prod.totalrow = prod.totalrow + newProd.value.totalrow;
        newProduct = 1;
      } else {
      }
    }
    return newProduct;
  }
  showTotalPriceForOrder() {
    let totalPrice = 0;
    for (const price of this.receiptService.getProducts()) {
      totalPrice += price.totalrow;
    }
    this.totalPriceForOrder = totalPrice;
  }
  totalPriceForProd() {
    this.totalPriceForProduct = this.product.pricebyunit * this.product.amount;
    this.product.totalrow = this.totalPriceForProduct;
    console.log(this.product.totalrow);
  }
  changeAmountInList(product, amount) {
    product.totalrow = product.pricebyunit * +amount;
    product.amount = amount;
    this.showTotalPriceForOrder();
    console.log(product, amount, product.totalrow);
  }
  deleteProduct(productId: number) {
    if (confirm('Are you sure to delete?')) {
      this.receiptService.setProducts(this.receiptService.getProducts().filter(data => data.productid != productId));
      this.showTotalPriceForOrder();
    }
  }
  backToPayment() {
    if (this.payByCreditCard) {
      this.dialog.open(CreditCardComponent, { width: '350px' });
      this.receiptService.setStep(2);
    } else {
      this.receiptService.setStep(2);
      this.receiptService.prevStep();
    }
  }
  addTotalPriceForEachProduct() {
    for (let prod of this.receiptService.getProducts()) {
      prod['totalall'] = this.totalPriceForOrder;
      prod['discount'] = 0;
    }
  }
  // Add products to the receipt in receipt service;
  addProductsToReceipt() {
    this.addTotalPriceForEachProduct();
    this.receiptService.newReceipt.Receipt.products = this.receiptService.getProducts();
    this.receiptService.storeAmount.next(this.totalPriceForOrder);
    // this.receiptService.amount.next(this.totalPriceForOrder);
    console.log(this.receiptService.newReceipt);
  }
  refreshForm() {
    this.form.controls.amount.reset();
    this.form.controls.productName.reset();
    console.log(this.form);
  }
  ngOnDestroy() {
    console.log('STORE SUBSCRIBE', this.subscriptions);
    this.subscriptions.unsubscribe();
    console.log('STORE SUBSCRIBE On Destroy', this.subscriptions);
  }
}
