/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User as UserEntity } from 'src/db/entities/user.entitiy';

declare module 'express' {
	export interface Request {
		user?: UserEntity;
	}
}

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<Request>();
	return request.user;
});
