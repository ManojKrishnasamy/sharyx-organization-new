import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JWTAuthController } from "@Controller/JWTAuth.controller";
import { AgentService } from "@Root/Service/Sharyx/AgentModule/Agent.service";
import { AgentModel } from "@Model/Sharyx/Agent.model";
import { CurrentUser, UserIp } from "@Root/Helper/Common.helper";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";

@Controller({ path: "Agent", version: "1" })
@ApiTags("Agent")
export class AgentController extends JWTAuthController {
  constructor(private _AgentService: AgentService) {
    super();
  }

  @Get("List")
  async List() {
    const list = await this._AgentService.GetAll();
    return this.SendResponseData(list);
  }

  @Get("ById/:Id")
  async ById(@Param("Id") Id: string) {
    const data = await this._AgentService.GetById(Id);
    return this.SendResponseData(data);
  }

  @Post("Insert")
  async Insert(
    @Body() Data: AgentModel,
    @CurrentUser() UserId: string,
    @UserIp() UserIp: string
  ) {
    const AgentData = await this._AgentService.Insert(Data, UserId, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created, AgentData.id);
  }


  @Put("Update/:Id")
  async Update(
    @Param("Id") Id: string,
    @Body() Data: AgentModel,
    @CurrentUser() UserId: string,
    @UserIp() UserIp: string
  ) {
    await this._AgentService.Update(Id, Data, UserId, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete("HardDelete/:Id")
  async HardDelete(@Param("Id") Id: string, @UserIp() UserIp: string) {
    await this._AgentService.HardDelete(Id, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }

  @Delete("SoftDelete/:Id")
  async SoftDelete(@Param("Id") Id: string, @UserIp() UserIp: string) {
    await this._AgentService.SoftDelete(Id, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }

}