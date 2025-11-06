import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { company } from '@Database/Table/Admin/company';
import { user } from '@Database/Table/Admin/user';
import { EncryptionService } from '../Encryption.service';
import { CustomerSignUpModel } from '@Model/Sharyx/CustomerSignUp.model';
import { customer } from '@Root/Database/Table/Sharyx/customer';
import { PricingPlanEnum } from '@Root/Helper/Enum/PricingPlanEnum';
import { workspace } from '@Root/Database/Table/Sharyx/workspace';
import { user_role } from '@Root/Database/Table/Admin/user_role';

@Injectable()
export class AuthService {
  constructor(private _JwtService: JwtService, private _EncryptionService: EncryptionService) { }

  async ValidateUser(username: string, password: string): Promise<any> {
    const UserData = await user.findOne({ where: { email: username }, relations: ['user_role'] });
    const CompanyData = await company.find({ relations: ["currency"] });
    if (!UserData) {
      throw new Error('Invalid email id');
    }
    if (UserData.status == false) {
      throw new Error('User suspended, contanct administration');
    }
    if (this._EncryptionService.Decrypt(UserData.password) != password) {
      throw new Error('Invalid password');
    }
    const CustomerData = await customer.findOne({ where: { id: UserData.customer_id } })
    const WorkspaceData = await workspace.findOne({ where: { customer_id: CustomerData.id } })


    const payload = {
      email: UserData.email,
      user_id: UserData.id,
      user_role_id: UserData.user_role_id,
      user_role_name: UserData.user_role.name,
      customer_data: CustomerData,
      workspace_data: WorkspaceData,
      company: CompanyData[0]
    };
    const api_token = this._JwtService.sign(payload);
    return { api_token };
  }


  async Register(SignupData: CustomerSignUpModel) {
    // ✅ 1. Check existing email
    const existingUser = await user.findOne({ where: { email: SignupData.email } });
    if (existingUser) throw new BadRequestException("Email already registered.");

    const existingworkspace = await workspace.findOne({ where: { name: `${SignupData.workspace_name} Workspace` } });
    if (existingworkspace) throw new BadRequestException(`${SignupData.workspace_name} Workspace already registered.please Try New One`);

    const existingcompany = await customer.findOne({ where: { name: SignupData.company_name } });
    if (existingcompany) throw new BadRequestException(`${SignupData.company_name} Company already registered.please Try New One`);


    // ✅ 2. Create Customer
    const _customer = new customer();
    _customer.name = SignupData.company_name;
    _customer.workspace_name = SignupData.workspace_name;
    _customer.email = SignupData.email;
    _customer.plan_type = PricingPlanEnum.Free;
    _customer.created_by_id = "new_customer";
    _customer.created_on = new Date();
    await _customer.save();

    // ✅ 3. Create Workspace
    const _workspace = new workspace();
    _workspace.customer_id = _customer.id;
    _workspace.name = `${SignupData.workspace_name}'s Workspace`;
    _workspace.slug = SignupData.workspace_name.toLowerCase();
    _workspace.created_by_id = "new_customer";
    _workspace.created_on = new Date();
    await _workspace.save();

    // ✅ 4. Create User (Admin)
    const UserRole = await user_role.findOne({ where: { name: "Customer" } })
    const _user = new user();
    _user.customer_id = _customer.id;
    _user.workspace_id = _workspace.id;
    _user.first_name = SignupData.user_name;
    _user.email = SignupData.email;
    _user.user_role_id = UserRole.id;
    _user.password = this._EncryptionService.Encrypt(SignupData.password);
    _user.created_by_id = "new_customer";
    _user.created_on = new Date();
    await _user.save();

    return _user.id;
  }

}
