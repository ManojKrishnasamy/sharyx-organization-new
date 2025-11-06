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
import { UserRoleService } from "@Service/Admin/UserRole.service";
import { ResponseEnum } from "@Helper/Enum/ResponseEnum";
import { UserRoleModel } from "@Model/Admin/UserRole.model";
import { JWTAuthController } from "@Controller/JWTAuth.controller";
import { CurrentUser, UserIp } from "@Root/Helper/Common.helper";

@Controller({ path: "UserRole", version: "1" })
@ApiTags("User Role")
export class UserRoleController extends JWTAuthController {
  constructor(private _UserRoleService: UserRoleService) {
    super();
  }

  @Get("List")
  async List() {
    const UserRoleListData =
      await this._UserRoleService.GetAllExpectSuperAdmin();
    return this.SendResponseData(UserRoleListData);
  }

  @Get("ById/:Id")
  async ById(@Param("Id") Id: string) {
    const UserRoleData = await this._UserRoleService.GetById(Id);
    return this.SendResponseData(UserRoleData);
  }

  @Post("Insert")
  async Insert(
    @Body() UserRoleData: UserRoleModel,
    @CurrentUser() UserId: string,
    @UserIp() UserIp: string
  ) {
    await this._UserRoleService.Insert(UserRoleData, UserId, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
  }

  @Put("Update/:Id")
  async Update(
    @Param("Id") Id: string,
    @Body() UserRoleData: UserRoleModel,
    @CurrentUser() UserId: string,
    @UserIp() UserIp: string
  ) {
    await this._UserRoleService.Update(Id, UserRoleData, UserId, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete("Delete/:Id")
  async Delete(@Param("Id") Id: string, @UserIp() UserIp: string) {
    await this._UserRoleService.Delete(Id, UserIp);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }
}
