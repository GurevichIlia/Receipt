import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { NewReceiptComponent } from "./receipts/new-receipt/new-receipt.component";
import { TestCComponent } from "./test-c/test-c.component";

const routes: Routes = [
  { path: "", redirectTo: "newreceipt",
   pathMatch: "full"
   },
  { path: "login", component: LoginComponent },
  { path: "newreceipt", component: NewReceiptComponent },
  { path: "test", component: TestCComponent }
  // { path: "home", loadChildren: "./home/home.module#HomePageModule" },
  // {
  //   path: "creat-receipt",
  //   loadChildren:
  //     "./pages/creat-receipt/creat-receipt.module#CreatReceiptPageModule",
  //   canActivate: [AuthGuardService]
  // },
  // {
  //   path: "login-page",
  //   loadChildren: "./pages/login-page/login-page.module#LoginPagePageModule"
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
