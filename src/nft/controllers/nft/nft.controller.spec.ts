import { Test, TestingModule } from '@nestjs/testing';
import { NftController } from './nft.controller';
import { NftService } from '../../../nft/services/nft/nft.service';
import { RegisterNftDto } from '../../services/nft/dtos/registerNft.dtos';
import { DeployNftDto } from '../../services/nft/dtos/deployNft.dtos';
import { HttpModule } from '@nestjs/axios';
import { Nft } from '../../../typeorm';
import { MintInterceptor } from '../../mint.interceptor';
import { HttpService } from '@nestjs/axios';
import { AppModule } from '../../../app.module';

const mockNftService = {
  getNft: jest.fn(),
  findNftById: jest.fn(),
  registerNft: jest.fn(),
  createNft: jest.fn(),
};

const mockNft: Nft = {
  id: 1,
  network: 11155111,
  contractAddress: '',
  tokenId: 0,
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

  describe('registerNft', () => {
    it('should return the registered Nft', async () => {
      const mockRegisterNftDto: RegisterNftDto = {
        network: 11155111,
        contractAddress: '0x27292E1a901E3E0bE7d144aDba4CAD07da2d8a42',
        tokenId: 0,
        assetType: 0,
        tangible: false,
        status: 0,
        resaleRights: 4,
        info: 'Registered by dev (test)',
      };
      mockNftService.registerNft.mockResolvedValue(mockNft);

      const result = await controller.registerNft(mockRegisterNftDto);

      expect(result).toEqual(mockNft);
      expect(mockNftService.registerNft).toHaveBeenCalledWith(
        mockRegisterNftDto,
      );
    });
  });

  describe('createNft', () => {
    it('should return the created Nft', async () => {
      const mockDeployNftDto: DeployNftDto = {
        network: 11155111,
        recipient: '0xd63ed6E274bedb34D9666B8f62ed32a73C43DD9e',
        name: 'Test Artwork',
        symbol: 'TEST',
        description: 'desc\n\nHello!',
        creatorAddress: '0xd63ed6E274bedb34D9666B8f62ed32a73C43DD9e',
        imageUrl:
          'https://bafybeiakz6ddls5hrcgrcpse3ofuqxx3octuedtapyxnstktyoadtwjjqi.ipfs.w3s.link/',
        resaleRights: 400,
        creatorName: 'Julien',
        status: 0,
        info: 'Registered by dev (test)',
      };
      mockNftService.createNft.mockResolvedValue(mockNft);

      const result = await controller.createNft(mockDeployNftDto);

      expect(result).toEqual(mockNft);
      expect(mockNftService.createNft).toHaveBeenCalledWith(mockDeployNftDto);
    });
  });
});
