import { Injectable } from "@nestjs/common";
import { CacheService } from "@Service/Cache.service";
import { CacheEnum } from "@Helper/Enum/CacheEnum";
import { AuditLogService } from "../../Admin/AuditLog.service";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { tts_config } from "@Root/Database/Table/Sharyx/tts_config";
import { TTSConfigModel } from "@Model/Sharyx/TTSModel.model";

@Injectable()
export class TTSConfigService {
    constructor(
        private _AuditLogService: AuditLogService,
        private _CacheService: CacheService
    ) { }

    async GetAll() {
        const cacheKey = `${CacheEnum.TtsConfig}:*`;
        const cached = await this._CacheService.Get(cacheKey);
        if (cached.length > 0) return cached;

        const list = await tts_config.find({ relations: ['ai_providers', 'sub_ai_model_provider'] });
        await this._CacheService.Store(CacheEnum.TtsConfig, list);
        return list;
    }

    async GetById(Id: string) {
        const cacheKey = `${CacheEnum.TtsConfig}:${Id}`;
        const cached = await this._CacheService.Get(cacheKey);
        if (cached.length > 0) return cached[0];

        const data = await tts_config.findOne({ where: { id: Id } });
        await this._CacheService.Store(cacheKey, [data]);
        return data;
    }

        async GetByAgentId(Id: string) {
        const cacheKey = `${CacheEnum.TtsConfig}:${Id}`;
        const cached = await this._CacheService.Get(cacheKey);
        if (cached.length > 0) return cached[0];

        const data = await tts_config.findOne({ where: { agent_id: Id } });
        await this._CacheService.Store(cacheKey, [data]);
        return data;
    }


    async Insert(ttsConfigData: TTSConfigModel, UserId: string, UserIp: string) {
        const ttsConfig = new tts_config();
        ttsConfig.ai_provider_id = ttsConfigData.ai_provider_id;
        ttsConfig.sub_ai_model_provider_id = ttsConfigData.sub_ai_model_provider_id;
        ttsConfig.language_id = ttsConfigData.language_id;
        ttsConfig.config_json = ttsConfigData.config_json;
        ttsConfig.agent_id = ttsConfigData.agent_id;
        ttsConfig.created_by_id = UserId;
        ttsConfig.created_on = new Date();
        await tts_config.insert(ttsConfig);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: tts_config.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [ttsConfig.id],
            UserIp,
        });

        await this._CacheService.Store(CacheEnum.TtsConfig, [ttsConfig]);
        return ttsConfig;
    }


    async Update(Id: string, ttsConfigData: TTSConfigModel, UserId: string, UserIp: string) {
        const existing = await tts_config.findOne({ where: { id: Id } });
        if (!existing) throw new Error(ResponseEnum.NotFound);
        existing.ai_provider_id = ttsConfigData.ai_provider_id;
        existing.sub_ai_model_provider_id = ttsConfigData.sub_ai_model_provider_id;
        existing.language_id = ttsConfigData.language_id;
        existing.config_json = ttsConfigData.config_json;
        existing.updated_by_id = UserId;
        existing.updated_on = new Date();
        await tts_config.update(Id, existing);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: tts_config.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [existing.id],
            UserIp,
        });
        await this._CacheService.Store(CacheEnum.TtsConfig, [existing]);
        return existing;
    }

    async HardDelete(Id: string, UserIp: string) {
        const existing = await tts_config.findOne({ where: { id: Id } });
        if (!existing) throw new Error(ResponseEnum.NotFound);

        await existing.remove();

        this._AuditLogService.AuditEmitEvent({
            PerformedType: tts_config.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [existing.id],
            UserIp,
        });

        await this._CacheService.Remove(`${CacheEnum.TtsConfig}:${Id}`, existing);
        return true;
    }


    async SoftDelete(Id: string, UserIp: string) {
        const existing = await tts_config.findOne({ where: { id: Id } });
        if (!existing) throw new Error(ResponseEnum.NotFound);
        existing.status = false;
        await tts_config.update(Id, existing);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: tts_config.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [existing.id],
            UserIp,
        });

        await this._CacheService.Remove(`${CacheEnum.TtsConfig}:${Id}`, existing);
        return true;
    }
}
