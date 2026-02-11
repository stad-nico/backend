import { Global, Module } from '@nestjs/common';
import { Authorization } from './authorization';

@Module({
	providers: [Authorization],
	exports: [Authorization]
})
@Global()
export class AuthorizationModule {}
