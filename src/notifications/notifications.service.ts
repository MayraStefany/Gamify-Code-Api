import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';
import { RegisterNotification } from './dto';
import { UserService } from 'src/user/user.service';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private userService: UserService,
  ) {}

  async getAllNotifications() {
    return await this.notificationRepository.find({});
  }

  async createNotification(dto: RegisterNotification) {
    const userTokens = await this.userService.getAllTokens();
    const notification = this.notificationRepository.create(dto);

    await this.sendNotificationsToTokenArray(userTokens, dto);

    return await this.notificationRepository.save(notification);
  }

  private async sendNotificationsToTokenArray(
    tokens: string[],
    dto: RegisterNotification,
  ) {
    try {
      for (const token of tokens) {
        const failedTokens = [];
        if (token) {
          await axios
            .post(
              'https://fcm.googleapis.com/fcm/send',
              {
                to: token,
                content_available: true,
                mutable_content: true,
                data: {
                  title: dto.title,
                  message: dto.message,
                  isNotification: true,
                },
                notification: {
                  title: dto.title,
                  body: dto.message,
                  mutable_content: true,
                  sound: 'Tri-tone',
                },
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization:
                    'key=AAAAMgHU_us:APA91bFk8lrNM59sQCPJWMnqNsE9-TyuijiqFofPwEw2saF6U-1seKieUr43CIb1KqdN-OHuhWuFODSFSeOc4gqleB98pSR1hlH1-s8sJYTW7CH4ZajpFG-WdP-DGHlh52y776q0RvI9',
                },
              },
            )
            .catch((err) => {
              console.log('Error al enviar al token', err);
              failedTokens.push(token);
            });
        }
        if (failedTokens.length > 0)
          console.log('Tokens fallidos: ' + failedTokens);
      }
    } catch (error) {
      console.log('ERROR', error);
    }
  }
}
