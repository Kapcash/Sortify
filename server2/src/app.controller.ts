import { Controller, HttpService, Logger } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {
    // Log all axios requests
    this.httpService.axiosRef.interceptors.request.use((req) => {
      Logger.debug(`Request: ${req.method.toUpperCase()} - ${req.url}
      Headers: ${Object.keys(req.headers).filter((k) => typeof req.headers[k] === 'string').map((k) => `\n\t\t${k}: ${req.headers[k]}`)}
      Body: ${JSON.stringify(req.data)}`);
      return req;
    });

    // Log all axios responses
    this.httpService.axiosRef.interceptors.response.use((res) => {
      Logger.debug(`Response from: ${res.request.method.toUpperCase()} - ${res.config.url}
      Status: ${res.status} - ${res.statusText}
      Headers: ${Object.keys(res.headers).filter((k) => typeof res.headers[k] === 'string').map((k) => `\n\t\t${k}: ${res.headers[k]}`)}
      Body: ${JSON.stringify(res.data)}`);
      return res;
    }, (error) => {
      Logger.debug(`ERROR response from: ${error.request.method.toUpperCase()} - ${error.config.url}
      Status: ${error.response.status} - ${error.message}`);
      throw error;
    });
  }

}
