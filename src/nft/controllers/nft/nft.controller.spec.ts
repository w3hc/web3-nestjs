import { Test, TestingModule } from '@nestjs/testing';
import { NftController } from './nft.controller';
import { NftService } from '../../../nft/services/nft/nft.service';
import { DeployNftDto } from '../../services/nft/dtos/deployNft.dtos';
import { HttpModule } from '@nestjs/axios';
import { Nft } from '../../../typeorm';
import { MintInterceptor } from '../../mint.interceptor';
import { HttpService } from '@nestjs/axios';
import { AppModule } from 'src/app.module';

const mockNftService = {
  getNft: jest.fn(),
  findNftById: jest.fn(),
  createNft: jest.fn(),
  searchNftByMetadata: jest.fn(),
};

const mockNft: Nft = {
  id: 1,
  network: 11155111,
  contractAddress: '',
  tokenId: 1,
  metadata: 'hello',
};

describe('NftController', () => {
  let controller: NftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftController],
      providers: [NftService, MintInterceptor, HttpService],
      imports: [HttpModule, AppModule],
    })
      .overrideProvider(NftService)
      .useValue(mockNftService)
      .compile();

    controller = module.get<NftController>(NftController);
  });

  describe('getNft', () => {
    it('should return an array of Nft objects', async () => {
      const mockNfts: Nft[] = [mockNft];
      mockNftService.getNft.mockResolvedValue(mockNfts);

      const result = await controller.getNft();

      expect(result).toEqual(mockNfts);
      expect(mockNftService.getNft).toHaveBeenCalled();
    });
  });

  describe('findNftById', () => {
    it('should return a single Nft object', async () => {
      const mockNftId = 1;
      mockNftService.findNftById.mockResolvedValue(mockNft);

      const result = await controller.findNftById(mockNftId);

      expect(result).toEqual(mockNft);
      expect(mockNftService.findNftById).toHaveBeenCalledWith(mockNftId);
    });
  });

  describe('createNft', () => {
    it('should return the created Nft', async () => {
      const mockDeployNftDto: DeployNftDto = {
        network: 11155111,
        recipient: '0x3e50D7fAF96B4294367cC3563B55CBD02bB4cE4d',
        name: 'yo',
        description: 'yo',
        creatorName: 'yo',
        creatorAddress: '0x000000000000000000000000000000000default',
        imageUrl:
          'https://bafybeiakz6ddls5hrcgrcpse3ofuqxx3octuedtapyxnstktyoadtwjjqi.ipfs.w3s.link/',
        resaleRights: 800,
        symbol: 'MYNFT',
        redeemable: false,
      };
      mockNftService.createNft.mockResolvedValue(mockNft);

      const result = await controller.createNft(mockDeployNftDto);

      expect(result).toEqual(mockNft);
      expect(mockNftService.createNft).toHaveBeenCalledWith(mockDeployNftDto);
    });
  });
});
