import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import Configuration from "./Config/Configuration";
import { MulterModule } from "@nestjs/platform-express";
import { Redis } from "ioredis";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ClsModule } from "nestjs-cls";
import { CacheService } from "./Service/Cache.service";
import { AutoNumberController } from "./Controller/Admin/AutoNumber.controller";
import { LoginController } from "./Controller/Auth/Login.controller";
import { UserController } from "./Controller/Admin/User.controller";
import { UserRoleController } from "./Controller/Admin/UserRole.controller";
import { EmailConfigController } from "./Controller/Admin/EmailConfig.controller";
import { CountryController } from "./Controller/Admin/Country.controller";
import { CurrencyController } from "./Controller/Admin/Currency.controller";
import { CompanyController } from "./Controller/Admin/Company.controller";
import { AuthService } from "./Service/Auth/Auth.service";
import { UserService } from "./Service/Admin/User.service";
import { UserRoleService } from "./Service/Admin/UserRole.service";
import { EmailService } from "./Service/Email.service";
import { EmailConfigService } from "./Service/Admin/EmailConfig.service";
import { CountryService } from "./Service/Admin/Country.service";
import { CurrencyService } from "./Service/Admin/Currency.service";
import { CompanyService } from "./Service/Admin/Company.service";
import { CommonService } from "./Service/Common.service";
import { JwtStrategy } from "./Service/Auth/JwtStrategy.service";
import { ErrorLogController } from "./Controller/Admin/ErrorLog.controller";
import { AuditLogController } from "./Controller/Admin/AuditLog.controller";
import { ErrorLogService } from "./Service/Admin/ErrorLog.service";
import { AuditLogService } from "./Service/Admin/AuditLog.service";
import { ExceptionHelper } from "./Helper/Exception.helper";
import { MailerService } from "./Service/Mailer.service";
import { EncryptionService } from "./Service/Encryption.service";
import { CommonSeederService } from "./Database/Seeds/CommonSeeder.service";
import { AIProviderController } from "./Controller/Sharyx/OtherAiProvider/AIProvider.controller";
import { SubAIModelProviderController } from "./Controller/Sharyx/OtherAiProvider/SubAIModelProvider.controller";
import { AIProviderService } from "./Service/Sharyx/OtherAiProvider/AIProvider.service";
import { SubAIModelProviderService } from "./Service/Sharyx/OtherAiProvider/SubAIModelProvider.service";
import { LanguageController } from "./Controller/Sharyx/OtherAiProvider/Language.controller";
import { LanguageService } from "./Service/Sharyx/OtherAiProvider/Language.service";
import { AgentController } from "./Controller/Sharyx/AgentModule/Agent.controller";
import { STTConfigController } from "./Controller/Sharyx/AgentModule/SttConfig.controller";
import { LLMConfigController } from "./Controller/Sharyx/AgentModule/LlmConfig.controller";
import { TTSConfigController } from "./Controller/Sharyx/AgentModule/TtsConfig.controller";
import { AgentService } from "./Service/Sharyx/AgentModule/Agent.service";
import { STTConfigService } from "./Service/Sharyx/AgentModule/SttConfig.service";
import { LLMConfigService } from "./Service/Sharyx/AgentModule/LlmConfig.service";
import { TTSConfigService } from "./Service/Sharyx/AgentModule/TtsConfig.service";
import { StreamController } from "./Service/Sharyx/voice/stream.controller";
import { StreamService } from "./Service/Sharyx/voice/stream.service";
import { DeepgramService } from "./Service/Sharyx/voice/deepgram.service";
import { SarvamService } from "./Service/Sharyx/voice/sarvam.service";
import { STTFactoryService } from "./Service/Sharyx/voice/stt-factory.service";
import { OpenAIService } from "./Service/Sharyx/voice/openai.service";
import { ElevenLabsService } from "./Service/Sharyx/voice/elevenlabs.service";
import { ConversationService } from "./Service/Sharyx/conversation/conversation.service";


@Module({
  imports: [
    ClsModule,
    ServeStaticModule.forRoot({
      rootPath: __dirname + "/client",
      exclude: ["/api/*", "swagger"],
    }),
    EventEmitterModule.forRoot({ maxListeners: 0 }),
    ConfigModule.forRoot({ isGlobal: true, load: [Configuration] }),
    MulterModule.register(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (_ConfigService: ConfigService) => ({
        type: "postgres",
        host: _ConfigService.get("Database.Host"),
        port: _ConfigService.get("Database.Port"),
        username: _ConfigService.get("Database.User"),
        password: _ConfigService.get("Database.Password"),
        database: _ConfigService.get("Database.Name"),
        synchronize: _ConfigService.get("Database.Sync"),
        keepConnectionAlive: true,
        entities: [__dirname + "/Database/**/*.{ts,js}"],
        logger: "advanced-console",
        logging: _ConfigService.get("Database.LOG"),
        bigNumberStrings: false,
        supportBigNumbers: true,
        dateStrings: true,
        timezone: "local",
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      defaultStrategy: "jwt",
      session: true,
      property: "user",
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (_ConfigService: ConfigService) => ({
        secret: _ConfigService.get("JWT.SecertToken"),
        signOptions: { expiresIn: _ConfigService.get("JWT.ExpiresIn") },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    LoginController,
    UserController,
    UserRoleController,
    EmailConfigController,
    CountryController,
    CurrencyController,
    CompanyController,
    ErrorLogController,
    AuditLogController,
    AutoNumberController,
    AIProviderController,
    SubAIModelProviderController,
    LanguageController,
    AgentController,
    STTConfigController,
    LLMConfigController,
    TTSConfigController,
    StreamController,
  ],
  providers: [
    AuthService,
    UserService,
    UserRoleService,
    EmailService,
    EmailConfigService,
    CountryService,
    CurrencyService,
    CompanyService,
    CommonService,
    JwtStrategy,
    ErrorLogService,
    AuditLogService,
    AIProviderService,
    SubAIModelProviderService,
    LanguageService,
    AgentService,
    STTConfigService,
    LLMConfigService,
    TTSConfigService,
    StreamService,
    DeepgramService,
    SarvamService,
    STTFactoryService,
    OpenAIService,
    ElevenLabsService,
    ConversationService,
    {
      provide: APP_FILTER,
      useClass: ExceptionHelper,
    },
    MailerService,
    EncryptionService,
    CommonSeederService,
    CacheService,
    {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        });
      },
    },
    CacheService,
  ],
  exports: [AuthService, EncryptionService],
})
export class AppModule { }
