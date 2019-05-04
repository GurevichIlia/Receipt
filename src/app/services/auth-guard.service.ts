import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { CanActivate } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  constructor(private authServices: AuthenticationService) {}

  canActivate(): boolean {
    return this.authServices.isAuthenticated();
  }
}
