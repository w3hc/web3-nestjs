import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { DeployNftDto } from '../../services/nft/dtos/deployNft.dtos';
import { NftService } from '../../services/nft//nft.service';
import { MintInterceptor } from '../../mint.interceptor';
import { ApiKeyGuard } from '../../../auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiHeader,
} from '@nestjs/swagger';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get()
  @ApiTags('Public methods')
  getNft() {
    return this.nftService.getNft();
  }

  @Get('id/:id')
  @ApiTags('Public methods')
  findNftById(@Param('id', ParseIntPipe) id: number) {
    return this.nftService.findNftById(id);
  }

  @Get(':stringOfCharacters')
  @ApiTags('Public methods')
  searchNftByMetadata(
    @Param('stringOfCharacters', ValidationPipe) stringOfCharacters: string,
  ) {
    return this.nftService.searchNftByMetadata(stringOfCharacters);
  }

  @UseGuards(ApiKeyGuard)
  @UseInterceptors(MintInterceptor)
  @Post('create')
  @ApiTags('Restricted access')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create POST method',
    description: 'Create an NFT',
  })
  @ApiHeader({
    name: 'api-key',
    description: 'Your API key',
    required: true,
  })
  @UsePipes(ValidationPipe)
  createNft(@Body() deployNft: DeployNftDto) {
    return this.nftService.createNft(deployNft);
  }
}
