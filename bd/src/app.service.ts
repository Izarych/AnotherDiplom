import { Injectable, NotFoundException } from '@nestjs/common';
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
 // !!!!
  async updateCan(id: number, num: number) {
    const can = await this.cansRepository.findByPk(id);
    let content: number = can.content += Number(num);
    if (content < 0) content = 0;
    await can.update({content: content})
    return can.content;
  }

  async changeCan(id: number, num: number) {
    const can = await this.cansRepository.findByPk(id);
    if (!can) {
      throw new NotFoundException(`Контейнера с номером ${id} не существует`)
    }
    await can.update({content: num})
    return can;
  }

  async deleteCan(id: number) {
    const can = await this.cansRepository.findByPk(id);
    if (!can) {
      throw new NotFoundException(`Контейнера с номером ${id} не существует`)
    }
    await can.destroy();
    return {
      message: 'Контейнер был успешно удален'
    }
  }
}
