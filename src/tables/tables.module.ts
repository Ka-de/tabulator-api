import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TablesController } from './tables.controller';
import { TablesService } from './services/tables.service';
import { Table, TableSchema } from './schema/tables.schema';
import { TablesColumnService } from './services/tables-column.service';
import { TablesRowService } from './services/tables-row.service';
import { ValidateRow } from 'src/shared/row.validator';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Table.name, schema: TableSchema }
    ])
  ],
  controllers: [TablesController],
  providers: [
    TablesService,
    TablesColumnService,
    TablesRowService,
    ValidateRow
  ]
})
export class TablesModule { }
