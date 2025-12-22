import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() body: { name: string; email: string; company?: string; phone?: string }) {
    this.logger.log(`POST /clients - Creating: ${body.name}`);
    return this.clientsService.create({
      name: body.name,
      email: body.email,
      company: body.company,
      phone: body.phone,
    });
  }

  @Get()
  findAll() {
    this.logger.log('GET /clients - Fetching all');
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`GET /clients/${id}`);
    return this.clientsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    this.logger.log(`PUT /clients/${id}`);
    return this.clientsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log(`DELETE /clients/${id}`);
    return this.clientsService.delete(id);
  }
}
