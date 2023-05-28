import { Injectable } from '@nestjs/common';
import { Cans } from './cans.model';
import { InjectModel } from '@nestjs/sequelize';
import { CansDto } from './dto/cans.dto';

@Injectable()
export class AppService {
  constructor(@InjectModel(Cans) private cansRepository: typeof Cans) {
  }

  async getAllCans() : Promise<Cans[]> {
    return this.cansRepository.findAll();
  }

  async createCan(cansDto : CansDto) : Promise<Cans> {
    return this.cansRepository.create(cansDto);
  }

  async updateCan(id: number, num: number) {
    const can = await this.cansRepository.findByPk(id);
    const content: number = can.content += Number(num);
    await can.update({content: content})
    await can.save();
    return can.content;
  }
}
