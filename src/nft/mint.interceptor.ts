import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ethers } from 'ethers';
import * as nftContract from './NFT.json';
import { NFTStorage, File } from 'nft.storage';
import axios from 'axios';
import { Nft } from '../typeorm/nft.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MintInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Nft)
    private readonly nftRepository: Repository<Nft>,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    try {
      console.log('\n///// Create ///// ');

      const now = Date.now();

      const request = context.switchToHttp().getRequest();
      const {
        network,
        recipient,
        name,
        description,
        creatorAddress,
        resaleRights,
        imageUrl,
        symbol,
        creatorName,
      } = request.body;

      const provider = new ethers.JsonRpcProvider(
        'https://sepolia.optimism.io',
      );
      const pKey = process.env.SIGNER_PRIVATE_KEY;
      const specialSigner = new ethers.Wallet(pKey as string, provider);

      const signerCurrentBalance = ethers.formatEther(
        String(await provider.getBalance(specialSigner.address)),
      );
      console.log('signerCurrentBalance:', signerCurrentBalance);

      if (Number(signerCurrentBalance) < 0.001) {
        console.log('Issuer balance inferior to 0.1 ETH');
        throw new Error('Insufficient balance');
      }

      ///// NFT metadata construction /////

      const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });

      async function downloadImage(url: string): Promise<File> {
        try {
          const response = await axios.get(url, {
            responseType: 'arraybuffer',
          });
          const fileData = Buffer.from(response.data);
          const fileName = 'image.jpeg';
          const file = new File([fileData], fileName, { type: 'image/jpeg' });
          return file;
        } catch (error) {
          console.error('Error downloading image:', error.message);
          throw new Error('Error downloading image');
        }
      }

      const downloadedImage = await downloadImage(imageUrl);

      // Image storage
      const someBinaryImageData = downloadedImage;
      const imageFile = new File([someBinaryImageData], 'nft.png', {
        type: 'image/png',
      });
      const nftImageCid = await client.storeBlob(imageFile);

      const resaleRightsFormatted = resaleRights / 100;

      // Metadata construction
      const metadata = {
        name: name,
        description: description,
        creatorName: creatorName,
        creatorAddress: creatorAddress,
        image: String('ipfs://' + nftImageCid + ''),
        attributes: [
          {
            trait_type: 'Resale rights (%)',
            value: resaleRightsFormatted,
          },

          {
            trait_type: 'Creator',
            value: creatorName,
          },
          {
            trait_type: 'Creator wallet address',
            value: creatorAddress,
          },
        ],
      };

      // Metadata storage
      const metadataBlob = new Blob([JSON.stringify(metadata)]);
      const metadataCid = await client.storeBlob(metadataBlob);
      const uri = 'ipfs://' + metadataCid;

      ///// Deployment /////

      const abi = nftContract.abi;
      const bytecode = nftContract.bytecode;
      const contractFactory = new ethers.ContractFactory(
        abi,
        bytecode,
        specialSigner,
      );
      let deployTx;
      try {
        deployTx = await contractFactory.deploy(
          name,
          symbol,
          uri,
          recipient,
          resaleRights,
          recipient,
        );
      } catch (e) {
        console.log('error:', e);
        throw new Error('Insufficient balance');
      }
      // console.log('deployTx:', deployTx);
      const receipt = await deployTx.waitForDeployment();
      const contractAddress = receipt.target;
      console.log(
        '\ndeploy ✅ https://sepolia-optimism.etherscan.io/address/' +
          contractAddress +
          '#code',
      );

      console.log('receipt:', receipt);

      const signerBalanceAfterDeployment = ethers.formatEther(
        String(await provider.getBalance(specialSigner.address)),
      );
      console.log(
        'signerBalanceAfterDeployment:',
        signerBalanceAfterDeployment,
      );

      return next.handle().pipe(
        map(async (data) => {
          try {
            const nft = await this.nftRepository.findOne({
              where: {
                id: data.id,
              },
            });

            if (nft) {
              nft.metadata = JSON.stringify(metadata);
              nft.contractAddress = String(contractAddress);
              nft.tokenId = 1;
              await this.nftRepository.save(nft);
            }
          } catch (error) {
            console.error('Error:', error);
            throw new Error('Error saving metadata');
          }
          const modifiedData = {
            network: network,
            tokenId: data.tokenId,
            contract: String(contractAddress),
            ...data,
            etherscanLink:
              'https://sepolia-optimism.etherscan.io/token/' +
              String(contractAddress) +
              '?a=' +
              1,
            metadataUrl: uri,
            metadata: metadata,
          };
          delete modifiedData.contractAddress;
          return modifiedData;
        }),
        catchError((error) => {
          console.error('Error occurred:', error);
          return throwError(
            () =>
              new InternalServerErrorException('Something went wrong', error),
          );
        }),
        tap(() => {
          const elapsedTimeInSeconds = (Date.now() - now) / 1000;
          const deploymentCost =
            Number(signerBalanceAfterDeployment) - Number(signerCurrentBalance);
          console.log(
            `\n///// Create done (took ${elapsedTimeInSeconds} seconds) /////\n`,
          );
          console.log(`\nDeployment cost = ${deploymentCost} ETH\n`);
        }),
      );
    } catch (error) {
      switch (error.message) {
        case 'Insufficient balance':
          return throwError(
            () =>
              new BadRequestException(
                'Insufficient balance: please transfer some ETH to 0x3e50D7fAF96B4294367cC3563B55CBD02bB4cE4d',
              ),
          );
        case 'Error downloading image':
          return throwError(
            () => new BadRequestException('Error downloading image'),
          );
        case 'Error saving metadata':
          return throwError(
            () => new InternalServerErrorException('Error saving metadata'),
          );
        default:
          throw new InternalServerErrorException('Something went wrong');
      }
    }
  }
}
