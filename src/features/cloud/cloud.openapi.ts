import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SomethingWentWrongException } from 'src/shared/exceptions/SomethingWentWrongException';
import { TemplatedApiException } from 'src/util/openapi.utils';
import { GetStatsResponse } from './mapping/stats/get-stats.response';

export const Controller = applyDecorators(ApiTags('cloud'), ApiBearerAuth());

export const GetStats = applyDecorators(
	ApiOperation({
		operationId: 'getStats',
		summary: 'Get cloud statistics',
		description: 'Get statistics about the cloud for a user'
	}),
	ApiOkResponse({ type: GetStatsResponse, description: 'The statistics were retrieved successfully' }),
	TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
);
