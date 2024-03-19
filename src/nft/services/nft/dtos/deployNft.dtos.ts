import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeployNftDto {
  @ApiProperty({
    description: 'Network on wich the NFT currrently is',
    example: 11155111,
  })
  @IsNotEmpty()
  network: number;

  @ApiProperty({
    description: 'Recipient of the safeMint tx',
    example: '0x3e50D7fAF96B4294367cC3563B55CBD02bB4cE4d',
  })
  @IsNotEmpty()
  recipient: string;

  @ApiProperty({
    description: 'Name of the NFT',
    example: 'My NFT',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'NFT description',
    example: 'This is description.',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Name of the creator',
    example: 'Da Vinci',
  })
  @IsNotEmpty()
  creatorName: string;

  @ApiProperty({
    description: 'NFT creator wallet address',
    example: '0x3e50D7fAF96B4294367cC3563B55CBD02bB4cE4d',
  })
  @IsNotEmpty()
  creatorAddress: string;

  @ApiProperty({
    description: 'Media file URL',
    example:
      'https://bafybeiakz6ddls5hrcgrcpse3ofuqxx3octuedtapyxnstktyoadtwjjqi.ipfs.w3s.link/',
  })
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({
    description: 'Resale rights',
    example: 500,
  })
  @IsNotEmpty()
  resaleRights: number;

  @ApiProperty({
    description: 'NFT Symbol',
    example: 'MYNFT',
  })
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({
    description: 'Is the NFT redeemable or not?',
    example: false,
  })
  @IsNotEmpty()
  redeemable: boolean;
}
