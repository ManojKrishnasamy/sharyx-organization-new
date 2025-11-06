import { Injectable } from "@nestjs/common";
import { conversation } from "@Root/Database/Table/Sharyx/conversation";
import { message_stream } from "@Root/Database/Table/Sharyx/message";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";

@Injectable()
export class ConversationService {
  constructor(

  ) { }

  async createConversation(UserId: string) {
    const Conversation = new conversation();
    Conversation.user_id = UserId;
    Conversation.created_on = new Date();
    Conversation.created_by_id = '38db6a01-b3d3-4168-b49b-de4993af8cc9';

    const saved = await conversation.save(Conversation);
    return saved.id;
  }

  async addMessage(ConversationId: string, Role: string, Content: string) {
    const Message = new message_stream();
    Message.conversation_id = ConversationId;
    Message.role = Role;
    Message.content = Content;
    Message.created_on = new Date();
    Message.created_by_id = '38db6a01-b3d3-4168-b49b-de4993af8cc9';


    await message_stream.save(Message);
    return true;
  }

  async getConversationHistory(ConversationId: string) {
    const Messages = await message_stream.find({
      where: { conversation_id: ConversationId },
      order: { created_on: 'ASC' },
    });

    return [
      {
        role: 'system',
        content: 'You are a helpful AI voice assistant. Keep your responses concise and conversational.',
      },
      ...Messages.map(m => ({ role: m.role, content: m.content })),
    ];
  }

  async endConversation(ConversationId: string) {
    const existing = await conversation.findOne({ where: { id: ConversationId } });
    if (!existing) throw new Error(ResponseEnum.NotFound);

    existing.ended_at = new Date();
    await conversation.save(existing);

    return true;
  }


}
