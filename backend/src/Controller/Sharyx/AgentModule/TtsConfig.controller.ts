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
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { CurrentUser, UserIp } from "@Root/Helper/Common.helper";
import { SSTConfigModel } from "@Model/Sharyx/STTConfig.model";
import { TTSConfigService } from "@Root/Service/Sharyx/AgentModule/TtsConfig.service";

@Controller({ path: "TTSConfig", version: "1" })
@ApiTags("TTSConfig")
export class TTSConfigController extends JWTAuthController {
    constructor(private _TTSConfigService: TTSConfigService) {
        super();
    }

    @Get("List")
    async List() {
        const list = await this._TTSConfigService.GetAll();
        return this.SendResponseData(list);
    }

    @Get("ById/:Id")
    async ById(@Param("Id") Id: string) {
        const data = await this._TTSConfigService.GetById(Id);
        return this.SendResponseData(data);
    }

    @Get("GetByAgentId/:Id")
    async GetByAgentId(@Param("Id") Id: string) {
        const data = await this._TTSConfigService.GetByAgentId(Id);
        return this.SendResponseData(data);
    }

    @Post("Insert")
    async Insert(
        @Body() Data: SSTConfigModel,
        @CurrentUser() UserId: string,
        @UserIp() UserIp: string
    ) {
        await this._TTSConfigService.Insert(Data, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }


    @Put("Update/:Id")
    async Update(
        @Param("Id") Id: string,
        @Body() Data: SSTConfigModel,
        @CurrentUser() UserId: string,
        @UserIp() UserIp: string
    ) {
        await this._TTSConfigService.Update(Id, Data, UserId, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete("HardDelete/:Id")
    async HardDelete(@Param("Id") Id: string, @UserIp() UserIp: string) {
        await this._TTSConfigService.HardDelete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }

    @Delete("SoftDelete/:Id")
    async SoftDelete(@Param("Id") Id: string, @UserIp() UserIp: string) {
        await this._TTSConfigService.SoftDelete(Id, UserIp);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }

}