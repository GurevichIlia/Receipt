import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MomentModule } from "ngx-moment";
import * as moment from "moment";

const TOKEN_KEY = "auth-token";

let TokenConfig = {
  tokenKey: TOKEN_KEY
};

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  authenticationstate = new BehaviorSubject(false);
  public tokenNo = "";

  constructor() {}

  login(tokenVal) {
    this.tokenNo = tokenVal;
    this.setSession(tokenVal);
    this.authenticationstate.next(true);
  }

  isAuthenticated() {
    //check memory
    this.authenticationstate.next(this.isLoggedIn());
    return this.authenticationstate.value;
  }

  // checkToken() {
  //   //shlomo call also to valoidate the token in the server
  //   this.authenticationstate.next(true);
  // }

  // getToken() {}

  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, "second");

    //  alert(3);

    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    //  alert(2);
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.authenticationstate.next(false);
  }

  public isLoggedIn() {
    //  alert(1);
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    // alert(4);
    return !this.isLoggedIn();
  }

  getExpiration() {
    //  alert(5);
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}

export { TokenConfig };
