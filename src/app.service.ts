import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { handleErrorCatch } from './helper';
import { User } from './models/user.model';
import * as bcrypt from 'bcryptjs';
// import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as shortid from 'shortid';

@Injectable()
export class AppService {
  private userRepo: Repository<User>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.userRepo = this.entityManager.getRepository(User);
  }

  async createUser(data: any) {
    try {
      if (!data.email) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Email is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!data.password) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Password is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!data.name) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Name is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const email = await this.userRepo.findOne({
        where: {
          email: data.email,
        },
      });

      if (email) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Email already used',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(data.password, salt);
      const user = await this.userRepo.save({
        ...data,
        password: hash,
        // id: shortid.generate(),
      });

      delete user.password;

      return user;
    } catch (err) {
      handleErrorCatch(err);
    }
  }

  async login(data: any): Promise<any> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          email: data.email.toLowerCase(),
        },
      });

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: `Invalid email or password`,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isValid = await bcrypt.compare(data.password, user.password);
      if (isValid) {
        const { password, ...result } = user;
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          'secret',
        );

        return {
          ...result,
          token,
        };
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: `Invalid email or password`,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
