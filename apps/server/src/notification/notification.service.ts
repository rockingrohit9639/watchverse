import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Novu, TriggerRecipientsTypeEnum } from '@novu/node'
import { EnvironmentVars } from '~/config/config.options'
import { NOVU_WORKFLOW_ID } from '~/config/constants'
import { SanitizedUser } from '~/user/user.types'

@Injectable()
export class NotificationService {
  private readonly novu: Novu
  constructor(private readonly configService: ConfigService<EnvironmentVars>) {
    this.novu = new Novu(configService.get('NOVU_API_KEY'))
  }

  async createSubscriber(user: SanitizedUser) {
    await this.novu.subscribers.identify(user.id, {
      email: user.email,
      firstName: user.name,
    })
  }

  /** A topic is basically a group of subscribers. Using a topic, notifications can be send to multiple subscribers at once. */
  async createTopic(key: string, name: string) {
    await this.novu.topics.create({ key, name })
  }

  async addSubscriber(topicKey: string, subscriberId: string) {
    await this.novu.topics.addSubscribers(topicKey, { subscribers: [subscriberId] })
  }

  async removeSubscriber(topicKey: string, subscriberId: string) {
    await this.novu.topics.removeSubscribers(topicKey, { subscribers: [subscriberId] })
  }

  async sendTopicNotifications(topicKey: string, description: string) {
    await this.novu.trigger(NOVU_WORKFLOW_ID, {
      to: [{ type: TriggerRecipientsTypeEnum.TOPIC, topicKey }],
      payload: { description },
    })
  }
}
