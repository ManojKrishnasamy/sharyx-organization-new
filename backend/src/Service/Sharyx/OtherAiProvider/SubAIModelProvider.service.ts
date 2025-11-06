import { Injectable } from "@nestjs/common";
import { CacheService } from "@Service/Cache.service";
import { CacheEnum } from "@Helper/Enum/CacheEnum";
import { LogActionEnum } from "@Helper/Enum/AuditLogEnum";
import { ResponseEnum } from "@Helper/Enum/ResponseEnum";
import { AuditLogService } from "../../Admin/AuditLog.service";
import { sub_ai_model_provider } from "@Root/Database/Table/Sharyx/sub_ai_model_provider";
import { SubAIModelProviderModel } from "@Model/Sharyx/SubAIModelProvider.model";
import { ai_model_languages } from "@Root/Database/Table/Sharyx/ai_model_languages";

@Injectable()
export class SubAIModelProviderService {
  constructor(
    private _AuditLogService: AuditLogService,
    private _CacheService: CacheService
  ) { }

  async GetAll() {
    const cacheKey = `${CacheEnum.SubAIModelProvider}:*`;
    const cached = await this._CacheService.Get(cacheKey);
    if (cached.length > 0) return cached;

    const list = await sub_ai_model_provider.find({ relations: ["ai_provider"] });
    await this._CacheService.Store(CacheEnum.SubAIModelProvider, list);
    return list;
  }

  async GetByAIProvidedId(Id: string) {
    const data = await sub_ai_model_provider.findOne({
      where: { ai_provider_id: Id }});
    return data;
  }

    async GetById(Id: string) {
    const data = await sub_ai_model_provider.findOne({
      where: { id: Id },
      relations: ["ai_provider"],
    });
    return data;
  }

  async GetLanguageByModelID(id: string) {
    const data = await ai_model_languages.find({
      where: { sub_ai_model_provider_id: id },
      relations: ['language']
    });
    return data;
  }
  async Insert(Data: SubAIModelProviderModel, UserId: string, UserIp: string) {
    const model = new sub_ai_model_provider();
    model.ai_provider_id = Data.ai_provider_id;
    model.model_name = Data.model_name;
    model.configuration = Data.configuration || {};
    model.created_by_id = UserId;
    model.created_on = new Date();

    await sub_ai_model_provider.insert(model);

    if (Data.language_ids && Data.language_ids.length > 0) {
      const languageRecords = Data.language_ids.map((langId) => {
        const langMap = new ai_model_languages();
        langMap.sub_ai_model_provider_id = model.id;
        langMap.language_id = langId;
        langMap.created_by_id = UserId;
        langMap.created_on = new Date();
        return langMap;
      });
      await ai_model_languages.save(languageRecords);
    }

    this._AuditLogService.AuditEmitEvent({
      PerformedType: sub_ai_model_provider.name,
      ActionType: LogActionEnum.Insert,
      PrimaryId: [model.id],
      UserIp,
    });

    await this._CacheService.Store(CacheEnum.SubAIModelProvider, [model]);
    return model;
  }

  async Update(Id: string, Data: SubAIModelProviderModel, UserId: string, UserIp: string) {
    const existing = await sub_ai_model_provider.findOne({ where: { id: Id } });
    if (!existing) throw new Error(ResponseEnum.NotFound);

    existing.ai_provider_id = Data.ai_provider_id;
    existing.model_name = Data.model_name;
    existing.configuration = Data.configuration || {};
    existing.updated_by_id = UserId;
    existing.updated_on = new Date();

    await sub_ai_model_provider.update(Id, existing);

    // Update related languages
    if (Data.language_ids && Data.language_ids.length > 0) {
      await ai_model_languages.delete({ sub_ai_model_provider_id: Id });

      const languageRecords = Data.language_ids.map((langId) => {
        const langMap = new ai_model_languages();
        langMap.sub_ai_model_provider_id = Id;
        langMap.language_id = langId;
        langMap.created_by_id = UserId;
        langMap.created_on = new Date();
        return langMap;
      });
      await ai_model_languages.save(languageRecords);
    }
    this._AuditLogService.AuditEmitEvent({
      PerformedType: sub_ai_model_provider.name,
      ActionType: LogActionEnum.Update,
      PrimaryId: [existing.id],
      UserIp,
    });

    await this._CacheService.Store(CacheEnum.SubAIModelProvider, [existing]);
    return existing;
  }

  async Delete(Id: string, UserIp: string) {
    const existing = await sub_ai_model_provider.findOne({ where: { id: Id } });
    if (!existing) throw new Error(ResponseEnum.NotFound);
    await ai_model_languages.delete({ sub_ai_model_provider_id: Id });
    await existing.remove();

    this._AuditLogService.AuditEmitEvent({
      PerformedType: sub_ai_model_provider.name,
      ActionType: LogActionEnum.Delete,
      PrimaryId: [existing.id],
      UserIp,
    });
    await this._CacheService.Remove(`${CacheEnum.SubAIModelProvider}:${Id}`, existing);

    return true;
  }

}
