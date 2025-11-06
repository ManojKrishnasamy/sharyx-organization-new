// src/Controller/Admin/Language.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { CurrentUser, UserIp } from '@Root/Helper/Common.helper';
import { LanguageService } from '@Root/Service/Sharyx/OtherAiProvider/Language.service';
import { LanguageModel } from '@Model/Sharyx/Language.model';

@Controller({ path: 'Language', version: '1' })
@ApiTags('Language')
export class LanguageController extends JWTAuthController {
  constructor(private _LanguageService: LanguageService) {
    super();
  }

  @Get('List')
  async List() {
    return this.SendResponseData(await this._LanguageService.GetAll());
  }

  @Get('ById/:Id')
  async ById(@Param('Id') Id: string) {
    return this.SendResponseData(await this._LanguageService.GetById(Id));
  }

  @Post('Insert')
  async Insert(@Body() data: LanguageModel, @CurrentUser() UserId: string, @UserIp() ip: string) {
    await this._LanguageService.Insert(data, UserId, ip);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
  }

  @Put('Update/:Id')
  async Update(@Param('Id') Id: string, @Body() data: LanguageModel, @CurrentUser() UserId: string, @UserIp() ip: string) {
    await this._LanguageService.Update(Id, data, UserId, ip);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete('Delete/:Id')
  async Delete(@Param('Id') Id: string, @UserIp() ip: string) {
    await this._LanguageService.Delete(Id, ip);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }
}
