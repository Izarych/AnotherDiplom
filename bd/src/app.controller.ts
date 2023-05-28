import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { Cans } from './cans.model';
import { CansDto } from './dto/cans.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getAll() : Promise<Cans[]> {
    return this.appService.getAllCans();
  }

  @Post()
  async create(@Body() canDto: CansDto) : Promise<Cans> {
    return this.appService.createCan(canDto);
  }

  @Put(':id/:number')
  async updateCan(@Param('id') id: number, @Param('number') num: number) {
    return this.appService.updateCan(id, num);
  }
}
