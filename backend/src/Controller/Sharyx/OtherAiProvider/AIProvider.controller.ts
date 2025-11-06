import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseEnum } from "@Helper/Enum/ResponseEnum";
import { JWTAuthController } from "@Controller/JWTAuth.controller";
import { CurrentUser, UserIp } from "@Helper/Common.helper";
import { AIProviderService } from "@Root/Service/Sharyx/OtherAiProvider/AIProvider.service";
import { AIProviderModel } from "@Model/Sharyx/AIProvider.model";

@Controller({ path: "AIProvider", version: "1" })
@ApiTags("AI Provider")
export class AIProviderController extends JWTAuthController {
  constructor(private _AIProviderService: AIProviderService) {
    super();
  }

  @Get("List")
  async List() {
    const list = await this._AIProviderService.GetAll();
    return this.SendResponseData(list);
  }

  @Get("ById/:Id")
  async ById(@Param("Id") Id: string) {
    const data = await this._AIProviderService.GetById(Id);
    return this.SendResponseData(data);
  }

  @Post("Insert")
  async Insert(
    @Body() Data: AIProviderModel,
    @CurrentUser() UserId: string,
    @UserIp() UserIp: string
  ) {
    await this._AIProviderService.Insert(Data, UserId, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
  }

  @Put("Update/:Id")
  async Update(
    @Param("Id") Id: string,
    @Body() Data: AIProviderModel,
    @CurrentUser() UserId: string,
    @UserIp() UserIp: string
  ) {
    await this._AIProviderService.Update(Id, Data, UserId, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete("Delete/:Id")
  async Delete(@Param("Id") Id: string, @UserIp() UserIp: string) {
    await this._AIProviderService.Delete(Id, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }
}
