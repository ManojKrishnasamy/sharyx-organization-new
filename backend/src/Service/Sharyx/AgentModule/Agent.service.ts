import { Injectable } from "@nestjs/common";
import { CacheService } from "@Service/Cache.service";
import { CacheEnum } from "@Helper/Enum/CacheEnum";
import { AuditLogService } from "../../Admin/AuditLog.service";
import { ai_agents } from "@Root/Database/Table/Sharyx/agent";
import { AgentModel } from "@Model/Sharyx/Agent.model";
import { LogActionEnum } from "@Root/Helper/Enum/AuditLogEnum";
import { randomBytes } from "crypto";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";

@Injectable()
export class AgentService {
  constructor(
    private _AuditLogService: AuditLogService,
    private _CacheService: CacheService
  ) { }

  async GetAll() {
    const cacheKey = `${CacheEnum.agent}:*`;
    const cached = await this._CacheService.Get(cacheKey);
    if (cached.length > 0) return cached;

    const list = await ai_agents.find({ relations: ['customer', 'workspace'] });
    await this._CacheService.Store(CacheEnum.agent, list);
    return list;
  }

  async GetById(Id: string) {
    const cacheKey = `${CacheEnum.agent}:${Id}`;
    const cached = await this._CacheService.Get(cacheKey);
    if (cached.length > 0) return cached[0];

    const data = await ai_agents.findOne({ where: { id: Id } });
    await this._CacheService.Store(cacheKey, [data]);
    return data;
  }


  async Insert(AgentData: AgentModel, UserId: string, UserIp: string) {
    const Agent = new ai_agents();
    Agent.name = AgentData.name;
    Agent.secure_id = await this.generateUniqueSecureId(Agent.name);
    Agent.workspace_id = AgentData.workspace_id;
    Agent.customer_id = AgentData.customer_id;
    Agent.created_by_id = UserId;
    Agent.created_on = new Date();

    await ai_agents.insert(Agent);

    this._AuditLogService.AuditEmitEvent({
      PerformedType: ai_agents.name,
      ActionType: LogActionEnum.Insert,
      PrimaryId: [Agent.id],
      UserIp,
    });

    await this._CacheService.Store(CacheEnum.agent, [Agent]);
    return Agent;
  }


  async Update(Id: string, AgentData: AgentModel, UserId: string, UserIp: string) {
    const existing = await ai_agents.findOne({ where: { id: Id } });
    if (!existing) throw new Error(ResponseEnum.NotFound);
    existing.name = AgentData.name;
    existing.customer_id = AgentData.customer_id;
    existing.workspace_id = AgentData.workspace_id;
    existing.secure_id = AgentData.secure_id;
    existing.updated_by_id = UserId;
    existing.updated_on = new Date();
    await ai_agents.update(Id, existing);
    this._AuditLogService.AuditEmitEvent({
      PerformedType: ai_agents.name,
      ActionType: LogActionEnum.Update,
      PrimaryId: [existing.id],
      UserIp,
    });
    await this._CacheService.Store(CacheEnum.agent, [existing]);
    return existing;
  }

  async HardDelete(Id: string, UserIp: string) {
    const existing = await ai_agents.findOne({ where: { id: Id } });
    if (!existing) throw new Error(ResponseEnum.NotFound);

    await existing.remove();

    this._AuditLogService.AuditEmitEvent({
      PerformedType: ai_agents.name,
      ActionType: LogActionEnum.Delete,
      PrimaryId: [existing.id],
      UserIp,
    });

    await this._CacheService.Remove(`${CacheEnum.agent}:${Id}`, existing);
    return true;
  }


  async SoftDelete(Id: string, UserIp: string) {
    const existing = await ai_agents.findOne({ where: { id: Id } });
    if (!existing) throw new Error(ResponseEnum.NotFound);
    existing.status = false;
    await ai_agents.update(Id, existing);
    this._AuditLogService.AuditEmitEvent({
      PerformedType: ai_agents.name,
      ActionType: LogActionEnum.Delete,
      PrimaryId: [existing.id],
      UserIp,
    });

    await this._CacheService.Remove(`${CacheEnum.agent}:${Id}`, existing);
    return true;
  }





  private generateSecureId(length = 8): string {
    return randomBytes(length).toString('hex');
  }

  private async generateUniqueSecureId(prefix: string): Promise<string> {
    let secureId: string;
    let exists = true;
    do {
      secureId = `${prefix}_${this.generateSecureId(4)}`;
      const existing = await ai_agents.findOne({ where: { secure_id: secureId } });
      exists = !!existing;
    } while (exists);

    return secureId;
  }

}
