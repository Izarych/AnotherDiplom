import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { Cans } from './cans.model';
import { CansDto } from './dto/cans.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAll() : Promise<Cans[]> {
    return this.appService.getAllCans();
  }

  @Post()
  create(@Body() canDto: CansDto) : Promise<Cans> {
    return this.appService.createCan(canDto);
  }

  @Put(':id/:number')
  updateCan(@Param('id') id: number, @Param('number') num: number): Promise<number> {
    return this.appService.updateCan(id, num);
  }

  @Put('/change/:id/:num')
  changeCan(@Param('id') id: number, @Param('num') num: number): Promise<Cans> {
    return this.appService.changeCan(id, num);
  }

  @Delete(':id')
  deleteCan(@Param('id') id: number): Promise<{message:string}> {
    return this.appService.deleteCan(id);
  }
}
