import { Controller, Post, Body, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { ForgotPasswordModel, ResetPasswordModel } from '@Model/Admin/User.model';
import { UserLoginModel } from '@Model/Admin/UserLogin.model';
import { UserService } from '@Service/Admin/User.service';
import { AuthService } from '@Service/Auth/Auth.service';
import { AuthBaseController } from '@Controller/AuthBase.controller';
import { CustomerSignUpModel } from '@Model/Sharyx/CustomerSignUp.model';
import { CacheService } from '@Root/Service/Cache.service';

@Controller({ path: "Auth", version: '1' })
@ApiTags("Auth")
export class LoginController extends AuthBaseController {
  constructor(
    private _AuthService: AuthService,
    private _CacheService:CacheService,
    private _UserService: UserService
  ) {
    super();
  }

  @Post('Login')
  async UserLogin(@Body() UserLogin: UserLoginModel) {
    const result = await this._AuthService.ValidateUser(UserLogin.email, UserLogin.password);
    return { Type: ResponseEnum.Success, Message: 'Login Successfully', result };
  }

  @Post("signup")
  async Signup(@Body() SignupData: CustomerSignUpModel) {
   const result = await this._AuthService.Register(SignupData);
   return { Type: ResponseEnum.Success, Message: 'Register Successfully', result };
  }

  @Post('ForgotPassword')
  async ForgotPassword(@Body() ForgotPasswordData: ForgotPasswordModel) {
    const Result = await this._UserService.ForgotPassword(ForgotPasswordData.email);
    if (Result.status) {
      return this.SendResponse(ResponseEnum.Success, "Forgot password request accepted, please check mail");
    }
    else {
      return this.SendResponse(ResponseEnum.Error, Result.message);
    }
  }

  @Post('ResetPassword')
  async ResetPassword(@Body() ResetPasswordData: ResetPasswordModel) {
    await this._UserService.ResetPassword(ResetPasswordData);
    return this.SendResponse(ResponseEnum.Success, "Password reseted successfully");
  }

    @Delete("ClearAllCache")
    async Delete() {
      await this._CacheService.Flush();
      return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }

}
