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
import { LLMConfigService } from "@Root/Service/Sharyx/AgentModule/LlmConfig.service";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { CurrentUser, UserIp } from "@Root/Helper/Common.helper";
import { LLMConfigModel } from "@Model/Sharyx/LLMConfig.model";

@Controller({ path: "LLMConfig", version: "1" })
@ApiTags("LLMConfig")
export class LLMConfigController extends JWTAuthController {
    constructor(private _LLMConfigService: LLMConfigService) {
        super();
    }

    @Get("List")
    async List() {
        const list = await this._LLMConfigService.GetAll();
        return this.SendResponseData(list);
    }

    @Get("ById/:Id")
    async ById(@Param("Id") Id: string) {
        const data = await this._LLMConfigService.GetById(Id);
        return this.SendResponseData(data);
    }
    @Get("GetByAgentId/:Id")
    async GetByAgentId(@Param("Id") Id: string) {
        const data = await this._LLMConfigService.GetByAgentId(Id);
        return this.SendResponseData(data);
    }

    @Post("Insert")
    async Insert(
        @Body() Data: LLMConfigModel,
        @CurrentUser() UserId: string,
        @UserIp() UserIp: string
    ) {
        await this._LLMConfigService.Insert(Data, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }


    @Put("Update/:Id")
    async Update(
        @Param("Id") Id: string,
        @Body() Data: LLMConfigModel,
        @CurrentUser() UserId: string,
        @UserIp() UserIp: string
    ) {
        await this._LLMConfigService.Update(Id, Data, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete("HardDelete/:Id")
    async HardDelete(@Param("Id") Id: string, @UserIp() UserIp: string) {
        await this._LLMConfigService.HardDelete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }

    @Delete("SoftDelete/:Id")
    async SoftDelete(@Param("Id") Id: string, @UserIp() UserIp: string) {
        await this._LLMConfigService.SoftDelete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }

}