import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { User } from 'src/db/entities/user.entitiy';
import * as CloudOpenApi from 'src/features/cloud/cloud.openapi';
import { User as UserDecorator } from 'src/shared/decorators/user.decorator';
import { CloudService } from './cloud.service';
import { GetStatsResponse } from './mapping/stats/get-stats.response';

@Controller('cloud')
@CloudOpenApi.Controller
export class CloudController {
	constructor(private readonly cloudService: CloudService) {}

	@Get('stats')
	@HttpCode(HttpStatus.OK)
	@CloudOpenApi.GetStats
	public async getStats(@UserDecorator() user: User): Promise<GetStatsResponse> {
		const { id } = user;

		return await this.cloudService.getStats(id);
	}
}
