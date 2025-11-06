import { Injectable } from "@nestjs/common";
import { CacheService } from "@Service/Cache.service";
import { CacheEnum } from "@Helper/Enum/CacheEnum";
import { AuditLogService } from "../../Admin/AuditLog.service";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { llm_config } from "@Root/Database/Table/Sharyx/llm_config";
import { LLMConfigModel } from "@Model/Sharyx/LLMConfig.model";

@Injectable()
export class LLMConfigService {
    constructor(
        private _AuditLogService: AuditLogService,
        private _CacheService: CacheService
    ) { }

    async GetAll() {
        const cacheKey = `${CacheEnum.LlmConfig}:*`;
        const cached = await this._CacheService.Get(cacheKey);
        if (cached.length > 0) return cached;

        const list = await llm_config.find({ relations: ['ai_providers', 'sub_ai_model_provider'] });
        await this._CacheService.Store(CacheEnum.LlmConfig, list);
        return list;
    }

    async GetById(Id: string) {
        const cacheKey = `${CacheEnum.LlmConfig}:${Id}`;
        const cached = await this._CacheService.Get(cacheKey);
        if (cached.length > 0) return cached[0];

        const data = await llm_config.findOne({ where: { id: Id } });
        await this._CacheService.Store(cacheKey, [data]);
        return data;
    }

            async GetByAgentId(Id: string) {
            const cacheKey = `${CacheEnum.LlmConfig}:${Id}`;
            const cached = await this._CacheService.Get(cacheKey);
            if (cached.length > 0) return cached[0];
    
            const data = await llm_config.findOne({ where: { agent_id: Id }});
            await this._CacheService.Store(cacheKey, [data]);
            return data;
        }


    async Insert(LLMConfigData: LLMConfigModel, UserId: string, UserIp: string) {
        const LLMConfig = new llm_config();
        LLMConfig.ai_provider_id = LLMConfigData.ai_provider_id;
        LLMConfig.welcome_message = LLMConfigData.welcome_message;
        LLMConfig.objective = LLMConfigData.objective;
        LLMConfig.system_prompt = LLMConfigData.system_prompt;
        LLMConfig.sub_ai_model_provider_id = LLMConfigData.sub_ai_model_provider_id;
        LLMConfig.language_id = LLMConfigData.language_id;
        LLMConfig.config_json = LLMConfigData.config_json;
        LLMConfig.agent_id = LLMConfigData.agent_id;
        LLMConfig.created_by_id = UserId;
        LLMConfig.created_on = new Date();
        await llm_config.insert(LLMConfig);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: llm_config.name,
            ActionType: LogActionEnum.Insert,
            PrimaryId: [LLMConfig.id],
            UserIp,
        });

        await this._CacheService.Store(CacheEnum.LlmConfig, [LLMConfig]);
        return LLMConfig;
    }

    async Update(Id: string, LLMConfigData: LLMConfigModel, UserId: string, UserIp: string) {
        const existing = await llm_config.findOne({ where: { id: Id } });
        if (!existing) throw new Error(ResponseEnum.NotFound);
        existing.welcome_message = LLMConfigData.welcome_message;
        existing.objective = LLMConfigData.objective;
        existing.system_prompt = LLMConfigData.system_prompt;
        existing.temperature = LLMConfigData.temperature;
        existing.ai_provider_id = LLMConfigData.ai_provider_id;
        existing.sub_ai_model_provider_id = LLMConfigData.sub_ai_model_provider_id;
        existing.language_id = LLMConfigData.language_id;
        existing.config_json = LLMConfigData.config_json;
        existing.agent_id = LLMConfigData.agent_id;
        existing.updated_by_id = UserId;
        existing.updated_on = new Date();

        await llm_config.update(Id, existing);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: llm_config.name,
            ActionType: LogActionEnum.Update,
            PrimaryId: [existing.id],
            UserIp,
        });
        await this._CacheService.Store(CacheEnum.LlmConfig, [existing]);
        return existing;
    }

    async HardDelete(Id: string, UserIp: string) {
        const existing = await llm_config.findOne({ where: { id: Id } });
        if (!existing) throw new Error(ResponseEnum.NotFound);

        await existing.remove();

        this._AuditLogService.AuditEmitEvent({
            PerformedType: llm_config.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [existing.id],
            UserIp,
        });

        await this._CacheService.Remove(`${CacheEnum.LlmConfig}:${Id}`, existing);
        return true;
    }


    async SoftDelete(Id: string, UserIp: string) {
        const existing = await llm_config.findOne({ where: { id: Id } });
        if (!existing) throw new Error(ResponseEnum.NotFound);
        existing.status = false;
        await llm_config.update(Id, existing);
        this._AuditLogService.AuditEmitEvent({
            PerformedType: llm_config.name,
            ActionType: LogActionEnum.Delete,
            PrimaryId: [existing.id],
            UserIp,
        });

        await this._CacheService.Remove(`${CacheEnum.LlmConfig}:${Id}`, existing);
        return true;
    }
}
