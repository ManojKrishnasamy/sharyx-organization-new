import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, UserIp } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { CurrencyService } from '@Service/Admin/Currency.service';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { CurrencyModel } from '@Model/Admin/Currency.model';
import { JWTAuthController } from '@Controller/JWTAuth.controller';

@Controller({ path: "Currency", version: '1' })
@ApiTags("Currency")
export class CurrencyController extends JWTAuthController {

  constructor(private _CurrencyService: CurrencyService) {
    super()
  }

  @Get('List')
  async List() {
    const CurrencyListData = await this._CurrencyService.GetAll();
    return this.SendResponseData(CurrencyListData);
  }

  @Get('ById/:Id')
  async ById(@Param('Id') Id: string) {
    const CurrencyData = await this._CurrencyService.GetById(Id);
    return this.SendResponseData(CurrencyData);
  }

  @Post('Insert')
  async Insert(@Body() CurrencyData: CurrencyModel, @CurrentUser() UserId: string,@UserIp() UserIp: string) {
    await this._CurrencyService.Insert(CurrencyData, UserId,UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
  }

  @Put('Update/:Id')
  async Update(@Param('Id') Id: string, @Body() CurrencyData: CurrencyModel, @CurrentUser() UserId: string,@UserIp() UserIp: string) {
    await this._CurrencyService.Update(Id, CurrencyData, UserId,UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete('Delete/:Id')
  async Delete(@Param('Id') Id: string,@UserIp() UserIp: string) {
    await this._CurrencyService.Delete(Id,UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }

}
