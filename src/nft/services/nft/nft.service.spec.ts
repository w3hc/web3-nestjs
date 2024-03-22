import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NftService } from './nft.service';
import { Repository } from 'typeorm';
import { Nft } from '../../../typeorm';
import { DeployNftDto } from './dtos/deployNft.dtos';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  searchNftByMetadata: jest.fn(),
};

describe('NftService', () => {
  let service: NftService;
  let repository: Repository<Nft>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NftService,
        {
          provide: getRepositoryToken(Nft),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NftService>(NftService);
    repository = module.get<Repository<Nft>>(getRepositoryToken(Nft));
  });

  describe('createNft', () => {
    it('should create and save a new Nft', async () => {
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

      const mockCreatedNft: Nft = {
        id: 1,
        network: 11155111,
        contractAddress: '',
        tokenId: 1,
        metadata: 'metadata',
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockCreatedNft);
      jest.spyOn(repository, 'save').mockResolvedValue(mockCreatedNft);

      const result = await service.createNft(mockDeployNftDto);

      expect(repository.create).toHaveBeenCalledWith(mockDeployNftDto);
      expect(repository.save).toHaveBeenCalledWith(mockCreatedNft);

      expect(result).toEqual(mockCreatedNft);
    });
  });
});
