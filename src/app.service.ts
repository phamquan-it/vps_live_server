import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import * as si from 'systeminformation';

@Injectable()
export class AppService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '192.168.1.37',
        port: 3301,
      },
    });
    this.sendSystemInformation();
  }
  getHello(): string {
    return 'Hello World!';
  }
  async sendSystemInformation() {
    si.getAllData()
      .then((data) => {
        try {
          // Send system information to the server via TCP
          this.client.emit<any>('system_information', {
            bios: data.bios,
            cpu: data.cpu,
            os: data.os,
            partition: data.fsSize,
            memory: data.mem,
          });
        } catch (error) {
          console.error('Error fetching or sending system information:', error);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
}
