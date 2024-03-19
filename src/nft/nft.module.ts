import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NftController } from './controllers/nft/nft.controller';
import { NftService } from './services/nft/nft.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft } from 'src/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Nft]), HttpModule],

  controllers: [NftController],
  providers: [NftService],
})
export class NftModule {}
