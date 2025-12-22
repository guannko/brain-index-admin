import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Client, Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ClientCreateInput): Promise<Client> {
    this.logger.log(`Creating client: ${data.name}`);
    return this.prisma.client.create({
      data,
    });
  }

  async findAll(): Promise<Client[]> {
    return this.prisma.client.findMany({
      include: {
        projects: true,
        bots: true,
      },
    });
  }

  async findOne(id: string): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: { id },
      include: { projects: true, bots: true },
    });
  }

  async update(id: string, data: Prisma.ClientUpdateInput): Promise<Client> {
    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Client> {
    return this.prisma.client.delete({
      where: { id },
    });
  }
}
