import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
    @Get()
    home() {
        return "Welcome to my Movie API"
    }
}
