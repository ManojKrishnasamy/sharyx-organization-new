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
import { SubAIModelProviderService } from "@Root/Service/Sharyx/OtherAiProvider/SubAIModelProvider.service";
import { SubAIModelProviderModel } from "@Model/Sharyx/SubAIModelProvider.model";

@Controller({ path: "SubAIModelProvider", version: "1" })
@ApiTags("Sub AI Model Provider")
export class SubAIModelProviderController extends JWTAuthController {
  constructor(private _Service: SubAIModelProviderService) {
    super();
  }

  @Get("List")
  async List() {
    const list = await this._Service.GetAll();
    return this.SendResponseData(list);
  }

    @Get("GetByAIProvidedId/:Id")
  async GetByAIProvidedId(@Param("Id") Id: string) {
    const data = await this._Service.GetByAIProvidedId(Id);
    return this.SendResponseData(data);
  }
  
  @Get("ById/:Id")
  async ById(@Param("Id") Id: string) {
    const data = await this._Service.GetById(Id);
    return this.SendResponseData(data);
  }

    @Get("GetLanguageByModelID/:Id")
  async GetLanguageByModelID(@Param("Id") Id: string) {
    const data = await this._Service.GetLanguageByModelID(Id);
    return this.SendResponseData(data);
  }

  @Post("Insert")
  async Insert(
    @Body() Data: SubAIModelProviderModel,
    @CurrentUser() UserId: string,
    @UserIp() UserIp: string
  ) {
    await this._Service.Insert(Data, UserId, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
  }

  @Put("Update/:Id")
  async Update(
    @Param("Id") Id: string,
    @Body() Data: SubAIModelProviderModel,
    @CurrentUser() UserId: string,
    @UserIp() UserIp: string
  ) {
    await this._Service.Update(Id, Data, UserId, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete("Delete/:Id")
  async Delete(@Param("Id") Id: string, @UserIp() UserIp: string) {
    await this._Service.Delete(Id, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }
}
