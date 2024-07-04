import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
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
    const cpu = await si.cpu();
    const mem = await si.mem();
    const os = await si.osInfo();
    exec('ipv4', (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }

      const ipv4 = stdout.trim().split(' ')[3]; // Extract the IP address from the output

      this.client.emit<any>('system_information', {
        ipv4: ipv4,
        cpu: cpu,
        os: os,
        memory: mem,
      });
    });
  }
}
