import { Injectable } from "@nestjs/common";
import { CacheService } from "@Service/Cache.service";
import { CacheEnum } from "@Helper/Enum/CacheEnum";
import { AuditLogService } from "../../Admin/AuditLog.service";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { sst_config } from "@Root/Database/Table/Sharyx/sst_config";
import { SSTConfigModel } from "@Model/Sharyx/STTConfig.model";

@Injectable()
export class STTConfigService {
    constructor(
        private _AuditLogService: AuditLogService,
        private _CacheService: CacheService
    ) { }

    async GetAll() {
        const cacheKey = `${CacheEnum.SttConfig}:*`;
        const cached = await this._CacheService.Get(cacheKey);
        if (cached.length > 0) return cached;

        const list = await sst_config.find({ relations: ['ai_providers', 'sub_ai_model_provider'] });
        await this._CacheService.Store(CacheEnum.SttConfig, list);
        return list;
    }

    async GetById(Id: string) {
        const cacheKey = `${CacheEnum.SttConfig}:${Id}`;
        const cached = await this._CacheService.Get(cacheKey);
        if (cached.length > 0) return cached[0];

        const data = await sst_config.findOne({ where: { id: Id } });
        await this._CacheService.Store(cacheKey, [data]);
        return data;
    }

            async GetByAgentId(Id: string) {
            const cacheKey = `${CacheEnum.SttConfig}:${Id}`;
            const cached = await this._CacheService.Get(cacheKey);
            if (cached.length > 0) return cached[0];
    
            const data = await sst_config.findOne({ where: { agent_id: Id }});
            await this._CacheService.Store(cacheKey, [data]);
            return data;
        }


    async Insert(SSTConfigData: SSTConfigModel, UserId: string, UserIp: string) {
        const SSTConfig = new sst_config();
        SSTConfig.ai_provider_id = SSTConfigData.ai_provider_id;
        SSTConfig.sub_ai_model_provider_id = SSTConfigData.sub_ai_model_provider_id;
        SSTConfig.language_id = SSTConfigData.language_id;
        SSTConfig.config_json = SSTConfigData.config_json;
        SSTConfig.agent_id = SSTConfigData.agent_id;
        SSTConfig.created_by_id = UserId;
        SSTConfig.created_on = new Date();
        await sst_config.insert(SSTConfig);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: sst_config.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [SSTConfig.id],
            UserIp,
        });

        await this._CacheService.Store(CacheEnum.SttConfig, [SSTConfig]);
        return SSTConfig;
    }


    async Update(Id: string, SSTConfigData: SSTConfigModel, UserId: string, UserIp: string) {
        const existing = await sst_config.findOne({ where: { id: Id } });
        if (!existing) throw new Error(ResponseEnum.NotFound);
        existing.ai_provider_id = SSTConfigData.ai_provider_id;
        existing.sub_ai_model_provider_id = SSTConfigData.sub_ai_model_provider_id;
        existing.language_id = SSTConfigData.language_id;
        existing.config_json = SSTConfigData.config_json;
        existing.updated_by_id = UserId;
        existing.updated_on = new Date();
        await sst_config.update(Id, existing);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: sst_config.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [existing.id],
            UserIp,
        });
        await this._CacheService.Store(CacheEnum.SttConfig, [existing]);
        return existing;
    }

    async HardDelete(Id: string, UserIp: string) {
        const existing = await sst_config.findOne({ where: { id: Id } });
        if (!existing) throw new Error(ResponseEnum.NotFound);

        await existing.remove();

        this._AuditLogService.AuditEmitEvent({
            PerformedType: sst_config.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [existing.id],
            UserIp,
        });

        await this._CacheService.Remove(`${CacheEnum.SttConfig}:${Id}`, existing);
        return true;
    }


    async SoftDelete(Id: string, UserIp: string) {
        const existing = await sst_config.findOne({ where: { id: Id } });
        if (!existing) throw new Error(ResponseEnum.NotFound);
        existing.status = false;
        await sst_config.update(Id, existing);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: sst_config.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [existing.id],
            UserIp,
        });

        await this._CacheService.Remove(`${CacheEnum.SttConfig}:${Id}`, existing);
        return true;
    }
}
