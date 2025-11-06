import { DataSource } from 'typeorm';
import { user_role } from '../Table/Admin/user_role';
import { user } from '../Table/Admin/user';
import { currency } from '../Table/Admin/currency';
import { country } from '../Table/Admin/country';
import { company } from '../Table/Admin/company';
import { Injectable } from '@nestjs/common';
import { EncryptionService } from '@Service/Encryption.service';

@Injectable()
export class CommonSeederService {
  constructor(
    private readonly _EncryptionService: EncryptionService,
    private _DataSource: DataSource
  ) {
  }
  async Run() {
    try {
      await this.UserRoleSeed();
    }
    catch (e) {
      console.log(e);
    }

    try {
      await this.UserSeed();
    }
    catch (e) {
      console.log(e);
    }

    try {
      await this.CurrencySeed();
    }
    catch (e) {
      console.log(e);
    }

    try {
      await this.CountrySeed();
    }
    catch (e) {
      console.log(e);
    }

    try {
      await this.CompanySeed();
    }
    catch (e) {
      console.log(e);
    }

  }


  UserRoleSeed = async () => {
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(user_role)
      .values([
        { name: 'Super Admin', code: '', created_by_id: "0", created_on: new Date() },
                { name: 'Customer', code: 'C', created_by_id: "0", created_on: new Date() }

      ])
      .execute()
  }

  UserSeed = async () => {
    const UserRoleData = await user_role.findOne({ where: { name: "Super Admin" } });
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(user)
      .values([
        {
          user_role_id: UserRoleData.id,
          email: 'admin@user.com',
          password: this._EncryptionService.Encrypt('Login123!!'),
          created_by_id: "0",
          created_on: new Date()
        }
      ])
      .execute()
  }

  CurrencySeed = async () => {
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(currency)
      .values([
        {
          name: 'rupee',
          code: 'INR',
          symbol: '₹',
          created_by_id: "0",
          created_on: new Date()
        }
      ])
      .execute()
  }

  CountrySeed = async () => {
    const CurrencyData = await currency.findOne({ where: { name: "rupee" } });
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(country)
      .values([
        {
          name: 'India',
          code: 'IN',
          currency_id: CurrencyData.id,
          created_by_id: "0",
          created_on: new Date()
        }
      ])
      .execute()
  }

  CompanySeed = async () => {
    const CurrencyData = await currency.findOne({ where: { name: "rupee" } });
    const CountryData = await country.findOne({ where: { name: "India" } });
    await this._DataSource.manager.createQueryBuilder()
      .insert()
      .into(company)
      .values([
        {
          name: "sharyx organization",
          address: "Coimbatore Tamilnadu India",
          postal_code: "641653",
          country_id: CountryData.id,
          currency_id: CurrencyData.id,
          email: "support@sharyx.com",
          website: "https://sharyx.com",
          invoice_footer: "sharyx.com",
          created_by_id: "0",
          created_on: new Date()
        }
      ])
      .execute()
  }

}

