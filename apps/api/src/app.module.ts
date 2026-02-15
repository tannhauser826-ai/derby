import { Module } from '@nestjs/common';
import { PublicModule } from './modules/public/public.module';

@Module({
  imports: [PublicModule],
})
export class AppModule {}
