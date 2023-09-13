import {
  HttpException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { EditUser, Login, RecoverPassword, RegisterUser } from './dto';
import { ObjectID } from 'mongodb';
import { GlobalSurveysService } from 'src/global-surveys/global-surveys.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private globalSurveyService: GlobalSurveysService,
  ) {}

  async createUser(dto: RegisterUser) {
    const userFound = await this.findUserByEmail(dto.email);
    if (userFound)
      throw new HttpException(
        {
          message: 'Ya existe un usuario con ese email.',
        },
        503,
      );
    const user = this.userRepository.create({ ...dto, points: 100 });
    return await this.userRepository.save(user);
  }

  async login(dto: Login) {
    const userFound = await this.userRepository.findOne({
      where: {
        email: dto.email,
        password: dto.password,
      },
    });

    if (userFound) {
      const isGlobalSurveyDone =
        await this.globalSurveyService.validateSurveyExits(
          userFound._id.toString(),
        );
      return {
        ...userFound,
        isGlobalSurveyDone: isGlobalSurveyDone ? true : false,
      };
    }

    throw new HttpException({ message: 'Credenciales incorrectas' }, 503);
  }

  async updateRecoverCode(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('No existe el usuario con ese correo.');
    }

    const sender = 'asistentegamify@gmail.com';

    const client = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: sender,
        pass: 'lkolhcyhmaevelxd',
      },
    });

    const recoverCode = Math.floor(100000 + Math.random() * 900000).toString();

    await client.sendMail({
      from: sender,
      to: email,
      subject: 'Codigo de recuperacion - Gamify',
      html: `Use el siguiente codigo <b>${recoverCode}</b>`,
    });

    await this.userRepository.update(user._id.toString(), { recoverCode });

    return true;
  }

  async updatePassword(dto: RecoverPassword) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('No existe el usuario.');
    }

    if (user.recoverCode !== dto.recoverCode) {
      throw new HttpException(
        {
          message: 'Codigo de recuperacion incorrecto',
        },
        503,
      );
    }

    await this.userRepository.update(user._id.toString(), {
      password: dto.password,
    });

    return { message: 'Contraseña actualizada.' };
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  async addTokenToUser(id: string, token: string) {
    return await this.userRepository.update(id, { token });
  }

  async findUserById(id: string) {
    const found = await this.userRepository.findOne({
      where: {
        _id: new ObjectID(id),
      },
    });

    if (!found) throw new NotFoundException('No existe el usuario.');

    return found;
  }

  async updateUserById(id: string, dto: EditUser) {
    const found = await this.userRepository.findOne({
      where: {
        _id: new ObjectID(id),
      },
    });

    if (!found) throw new NotFoundException('No existe el usuario a editar.');

    return await this.userRepository.update(id, dto);
  }

  async getAllTokens() {
    const users = await this.userRepository.find({});
    return users.map(({ token }) => token);
  }
}
