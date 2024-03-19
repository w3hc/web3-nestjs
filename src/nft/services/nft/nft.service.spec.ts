import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NftService } from './nft.service';
import { Repository } from 'typeorm';
import { Nft } from '../../../typeorm';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
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
        recipient: '0x27292E1a901E3E0bE7d144aDba4CAD07da2d8a42',
        tokenUri:
          'https://bafkreidrrwa6eckvudnokxsttfayckjvilqpote6xn3fc5beler76py57u.ipfs.w3s.link/',
        resaleRights: 400,
      };

      const mockCreatedNft: Nft = {
        id: 1,
        network: 11155111,
        contractAddress: '',
        tokenId: 1,
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockCreatedNft);
      jest.spyOn(repository, 'save').mockResolvedValue(mockCreatedNft);

      // The createNft method has changed, so this test is no longer relevant

      const result = await service.createNft(mockDeployNftDto);

      expect(repository.create).toHaveBeenCalledWith(mockDeployNftDto);
      expect(repository.save).toHaveBeenCalledWith(mockCreatedNft);

      expect(result).toEqual(mockCreatedNft);
    });
  });
});
