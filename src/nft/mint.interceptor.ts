import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
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

      // TODO: check if there's enough funds on the main wallet

      const provider = new ethers.JsonRpcProvider(
        'https://ethereum-sepolia.publicnode.com',
      );
      const pKey = process.env.SIGNER_PRIVATE_KEY;
      const specialSigner = new ethers.Wallet(pKey as string, provider);

      ///// Deployment /////

      const abi = nftContract.abi;
      const bytecode = nftContract.bytecode;
      const contractFactory = new ethers.ContractFactory(
        abi,
        bytecode,
        specialSigner,
      );
      const deployTx = await contractFactory.deploy(
        specialSigner.address,
        name,
        symbol,
        resaleRights,
      );
      const receipt = await deployTx.waitForDeployment();
      const contractAddress = receipt.target;
      console.log(
        '\ndeploy ✅ https://sepolia.etherscan.io/address/' +
          contractAddress +
          '#code',
      );

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
          throw error;
        }
      }

      const downloadedImage = await downloadImage(imageUrl);

      // Image storage
      const someBinaryImageData = downloadedImage;
      const imageFile = new File([someBinaryImageData], 'nft.png', {
        type: 'image/png',
      });
      const nftImageCid = await client.storeBlob(imageFile);
      // console.log('nftImageCid:', nftImageCid);

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

      ///// Mint /////

      const nft = new ethers.Contract(
        contractAddress as string,
        abi,
        specialSigner,
      );
      const mint = await nft.safeMint(recipient, uri);
      const mintReceipt = await mint.wait();
      console.log(
        '\nmint ✅ https://sepolia.etherscan.io/tx/' + mintReceipt.hash,
        '\n',
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
            throw error;
          }

          const modifiedData = {
            network: network,
            tokenId: data.tokenId,
            contract: String(contractAddress),
            ...data,
            mintHash: 'https://sepolia.etherscan.io/tx/' + mintReceipt.hash,
            openseaLink:
              'https://testnets.opensea.io/assets/sepolia/' +
              contractAddress +
              '/' +
              1,
            metadataUrl: uri,
            metadata: metadata,
          };
          return modifiedData;
        }),
        catchError((error) => {
          console.error('Error occurred:', error);
          throw new InternalServerErrorException('Something went wrong');
        }),
        tap(() => {
          const elapsedTimeInSeconds = (Date.now() - now) / 1000;
          console.log(
            `\n///// Create done (took ${elapsedTimeInSeconds} seconds) /////\n`,
          );
        }),
      );
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }
}
