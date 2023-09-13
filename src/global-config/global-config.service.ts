import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalConfig } from './global-config.entity';
import { WeeksService } from 'src/weeks/weeks.service';
import * as moment from 'moment';
import { FORMAT_DATE_HOUR } from 'src/events/utilities';
import axios from 'axios';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GlobalConfigService {
  constructor(
    @InjectRepository(GlobalConfig)
    private globalConfig: Repository<GlobalConfig>,
    private weekService: WeeksService,
    private userService: UserService,
  ) {}

  async getGlobalConfig() {
    return (
      (await this.globalConfig.find({}))[0] ?? {
        message: 'No hay configuracion global.',
      }
    );
  }

  async changeWeek(date: string) {
    const globalConfig = (await this.globalConfig.find({}))[0] ?? null;
    const weeks = await this.weekService.getWeeks();
    const dateCompare = moment(date, FORMAT_DATE_HOUR);
    const found = weeks.find((x) => {
      const compareStart = moment(x.start, FORMAT_DATE_HOUR);
      const compareEnd = moment(x.end, FORMAT_DATE_HOUR);

      if (
        dateCompare.isBetween(compareStart, compareEnd) ||
        compareStart.isSame(dateCompare) ||
        compareEnd.isSame(dateCompare)
      )
        return x;
    });

    if (found && globalConfig) {
      await this.globalConfig.update(globalConfig._id.toString(), {
        week: found._id.toString(),
      });

      await this.sendNotificationsToTokenArray(
        await this.userService.getAllTokens(),
        found._id.toString(),
      );

      return { message: `Se cambio a la semana  ${found.number}` };
    } else {
      return {
        message:
          'No se cambio debido a que supero o no se encuentra en algun rango de fechas.',
      };
    }
  }

  private async sendNotificationsToTokenArray(
    tokens: string[],
    weekId: string,
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
                  weekId,
                  updateWeek: true,
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
