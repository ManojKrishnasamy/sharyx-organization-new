import { Injectable } from "@nestjs/common";
import { CacheService } from "@Service/Cache.service";
import { CacheEnum } from "@Helper/Enum/CacheEnum";
import { LogActionEnum } from "@Helper/Enum/AuditLogEnum";
import { ResponseEnum } from "@Helper/Enum/ResponseEnum";
import { ai_providers } from "@Root/Database/Table/Sharyx/ai_providers";
import { AuditLogService } from "../../Admin/AuditLog.service";
import { AIProviderModel } from "@Model/Sharyx/AIProvider.model";

@Injectable()
export class AIProviderService {
  constructor(
    private _AuditLogService: AuditLogService,
    private _CacheService: CacheService
  ) { }

  async GetAll() {
    const cacheKey = `${CacheEnum.AIProvider}:*`;
    const cached = await this._CacheService.Get(cacheKey);
    if (cached.length > 0) return cached;

    const list = await ai_providers.find();
    await this._CacheService.Store(CacheEnum.AIProvider, list);
    return list;
  }

  async GetById(Id: string) {
    const cacheKey = `${CacheEnum.AIProvider}:${Id}`;
    const cached = await this._CacheService.Get(cacheKey);
    if (cached.length > 0) return cached[0];

    const data = await ai_providers.findOne({ where: { id: Id } });
    await this._CacheService.Store(cacheKey, [data]);
    return data;
  }

  async Insert(Data: AIProviderModel, UserId: string, UserIp: string) {
    const provider = new ai_providers();
    provider.name = Data.name;
    provider.type = Data.type;
    provider.api_key = Data.api_key;
    provider.base_url = Data.base_url;
    provider.created_by_id = UserId;
    provider.created_on = new Date();

    await ai_providers.insert(provider);

    this._AuditLogService.AuditEmitEvent({
      PerformedType: ai_providers.name,
      ActionType: LogActionEnum.Insert,
      PrimaryId: [provider.id],
      UserIp,
    });

    await this._CacheService.Store(CacheEnum.AIProvider, [provider]);
    return provider;
  }

  async Update(Id: string, Data: AIProviderModel, UserId: string, UserIp: string) {
    const existing = await ai_providers.findOne({ where: { id: Id } });
    if (!existing) throw new Error(ResponseEnum.NotFound);

    existing.name = Data.name;
    existing.type = Data.type;
    existing.api_key = Data.api_key;
    existing.base_url = Data.base_url;
    existing.updated_by_id = UserId;
    existing.updated_on = new Date();

    await ai_providers.update(Id, existing);

    this._AuditLogService.AuditEmitEvent({
      PerformedType: ai_providers.name,
      ActionType: LogActionEnum.Update,
      PrimaryId: [existing.id],
      UserIp,
    });

    await this._CacheService.Store(CacheEnum.AIProvider, [existing]);
    return existing;
  }

  async Delete(Id: string, UserIp: string) {
    const existing = await ai_providers.findOne({ where: { id: Id } });
    if (!existing) throw new Error(ResponseEnum.NotFound);

    await existing.remove();

    this._AuditLogService.AuditEmitEvent({
      PerformedType: ai_providers.name,
      ActionType: LogActionEnum.Delete,
      PrimaryId: [existing.id],
      UserIp,
    });

    await this._CacheService.Remove(`${CacheEnum.AIProvider}:${Id}`, existing);
    return true;
  }
}
