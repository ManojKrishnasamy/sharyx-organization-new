// src/Service/Admin/Language.service.ts
import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { LogActionEnum } from '@Helper/Enum/AuditLogEnum';
import { languages } from '@Root/Database/Table/Sharyx/languages';
import { AuditLogService } from '../../Admin/AuditLog.service';
import { LanguageModel } from '@Model/Sharyx/Language.model';

@Injectable()
export class LanguageService {
  constructor(private _AuditLogService: AuditLogService) { }

  async GetAll() {
    return await languages.find();
  }

  async GetById(Id: string) {
    const data = await languages.findOne({ where: { id: Id } });
    if (!data) throw new Error(ResponseEnum.NotFound);
    return data;
  }

  async Insert(LanguageData: LanguageModel, UserId: string, UserIp: string) {
    const _lang = new languages();
    _lang.name = LanguageData.name;
    _lang.code = LanguageData.code;
    _lang.type = LanguageData.type;
    _lang.status = LanguageData.status ?? true;
    _lang.created_by_id = UserId;
    _lang.created_on = new Date();
    await languages.insert(_lang);
    this._AuditLogService.AuditEmitEvent({
      PerformedType: languages.name,
      ActionType: LogActionEnum.Insert,
      PrimaryId: [_lang.id],
      UserIp,
    });
    return _lang;
  }

  async Update(Id: string, LanguageData: LanguageModel, UserId: string, UserIp: string) {
    const lang = await languages.findOne({ where: { id: Id } });
    if (!lang) throw new Error(ResponseEnum.NotFound);
    lang.name = LanguageData.name;
    lang.code = LanguageData.code;
    lang.type = LanguageData.type;
    lang.status = LanguageData.status;
    lang.updated_by_id = UserId;
    lang.updated_on = new Date();
    await languages.update(Id, lang);
    this._AuditLogService.AuditEmitEvent({
      PerformedType: languages.name,
      ActionType: LogActionEnum.Update,
      PrimaryId: [lang.id],
      UserIp,
    });
    return lang;
  }

  async Delete(Id: string, UserIp: string) {
    const lang = await languages.findOne({ where: { id: Id } });
    if (!lang) throw new Error(ResponseEnum.NotFound);
    await lang.remove();
    this._AuditLogService.AuditEmitEvent({
      PerformedType: languages.name,
      ActionType: LogActionEnum.Delete,
      PrimaryId: [lang.id],
      UserIp,
    });
    return true;
  }
}
