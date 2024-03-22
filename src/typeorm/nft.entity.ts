import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Nft {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    name: 'network',
    nullable: false,
    default: 11155420,
  })
  network: number;

  @Column({
    name: 'contractAddress',
    nullable: true,
    default: '0x000000000000000000000000000000000default',
  })
  contractAddress: string;

  @Column({
    name: 'tokenId',
    nullable: false,
    default: 1,
  })
  tokenId: number;

  @Column({
    name: 'metadata',
    nullable: true,
    default: 'default',
  })
  metadata: string;
}
