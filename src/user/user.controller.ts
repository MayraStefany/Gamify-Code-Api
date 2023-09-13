import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUser, Login, RecoverPassword } from './dto';
import { Trace } from 'easy-tracer';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Trace()
  async verifyUser(@Body() dto: RegisterUser) {
    return await this.userService.createUser(dto);
  }

  @Post('login')
  @Trace()
  async login(@Body() dto: Login) {
    return await this.userService.login(dto);
  }

  @Put(':id/add-token')
  @Trace()
  async addTokenToUser(
    @Param('id') id: string,
    @Body() { token }: { token: string },
  ) {
    return await this.userService.addTokenToUser(id, token);
  }

  @Post('recover-password')
  @Trace()
  async recoverPassword(@Body() dto: RecoverPassword) {
    return await this.userService.updatePassword(dto);
  }

  @Post('recover-code')
  @Trace()
  async sendRecoverCode(@Body() { email }: { email: string }) {
    return await this.userService.updateRecoverCode(email);
  }
}
