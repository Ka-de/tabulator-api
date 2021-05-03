import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from 'src/tables/schema/tables.schema';
import { TablesService } from 'src/tables/tables.service';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Table.name, schema: TableSchema }
    ])
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService, TablesService]
})
export class ColumnsModule {}
