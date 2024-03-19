import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nft } from '../../../typeorm';
import { Repository, ILike } from 'typeorm';
import { DeployNftDto } from './dtos/deployNft.dtos';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Nft) private readonly nftRepository: Repository<Nft>,
  ) {}

  createNft(createNft: DeployNftDto) {
    const newNft = this.nftRepository.create(createNft);
    return this.nftRepository.save(newNft);
  }

  getNft() {
    return this.nftRepository.find();
  }

  findNftById(id: number) {
    return this.nftRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  searchNftByMetadata(stringOfCharacters: string) {
    console.log('stringOfCharacters:', stringOfCharacters);
    return this.nftRepository.find({
      where: {
        metadata: ILike(`%${stringOfCharacters}%`),
      },
    });
  }
}
