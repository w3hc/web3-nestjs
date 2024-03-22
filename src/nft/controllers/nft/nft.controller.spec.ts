import { Test, TestingModule } from '@nestjs/testing';
import { NftController } from './nft.controller';
import { NftService } from '../../services/nft/nft.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Nft } from '../../../typeorm/nft.entity';
import { DeployNftDto } from '../../../nft/services/nft/dtos/deployNft.dtos';

describe('NftController', () => {
  let controller: NftController;
  let service: NftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftController],
      providers: [
        NftService,
        {
          provide: getRepositoryToken(Nft),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<NftController>(NftController);
    service = module.get<NftService>(NftService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNft', () => {
    it('should return all NFTs', async () => {
      const result = [
        {
          id: 1,
          network: 123,
          contractAddress: '0x...',
          tokenId: 1,
          metadata: '...',
        },
      ];
      jest.spyOn(service, 'getNft').mockResolvedValue(result);

      expect(await controller.getNft()).toBe(result);
    });
  });

  describe('findNftById', () => {
    it('should return NFT by id', async () => {
      const mockNftId = 1;
      const mockNft = {
        id: mockNftId,
        network: 123,
        contractAddress: '0x...',
        tokenId: 1,
        metadata: '...',
      };

      jest
        .spyOn(service, 'findNftById')
        .mockImplementation(async () => mockNft);

      const result = await controller.findNftById(mockNftId);

      expect(result).toEqual(mockNft);
    });
  });

  describe('createNft', () => {
    it('should create an NFT', async () => {
      const mockDeployNftDto: DeployNftDto = {
        network: 11155111,
        recipient: '0x3e50D7fAF96B4294367cC3563B55CBD02bB4cE4d',
        name: 'name',
        description: 'description',
        creatorName: 'creatorName',
        creatorAddress: '0x000000000000000000000000000000000default',
        imageUrl:
          'https://bafybeiakz6ddls5hrcgrcpse3ofuqxx3octuedtapyxnstktyoadtwjjqi.ipfs.w3s.link/',
        resaleRights: 800,
        symbol: 'MYNFT',
        redeemable: false,
      };

      const mockCreatedNft: Nft = {
        id: 1,
        network: 11155111,
        contractAddress: '',
        tokenId: 1,
        metadata: 'metadata',
      };

      jest
        .spyOn(service, 'createNft')
        .mockImplementation(async () => mockCreatedNft);

      const result = await controller.createNft(mockDeployNftDto);

      expect(result).toEqual(mockCreatedNft);
    });
  });
});
