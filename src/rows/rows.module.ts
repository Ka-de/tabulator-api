import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateRow } from 'src/shared/row.validator';
import { Table, TableSchema } from 'src/tables/schema/tables.schema';
import { TablesService } from 'src/tables/tables.service';
import { RowsController } from './rows.controller';
import { RowsService } from './rows.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Table.name, schema: TableSchema }
    ]),
    HttpModule
  ],
  controllers: [RowsController],
  providers: [RowsService, TablesService, ValidateRow]
})
export class RowsModule {}
