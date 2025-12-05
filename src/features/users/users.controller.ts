/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CreateUserBody } from 'src/features/users/mapping/create-user/create-user.body';
import { GetUserParams } from 'src/features/users/mapping/get-user/get-user.params';
import { GetUserResponse } from 'src/features/users/mapping/get-user/get-user.response';
import { UserOpenApi } from 'src/features/users/users.openapi';
import { UserService } from 'src/features/users/users.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('users')
@UserOpenApi.Controller
export class UserController {
	public constructor(private readonly userService: UserService) {}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@UserOpenApi.GetUser
	public async getUser(@Param() params: GetUserParams): Promise<GetUserResponse> {
		const user = await this.userService.getUserByIdOrThrow(params.id);

		return GetUserResponse.fromUser(user);
	}

	@Post()
	@Public()
	@HttpCode(HttpStatus.CREATED)
	@UserOpenApi.CreateUser
	public async createUser(@Body() params: CreateUserBody): Promise<void> {
		await this.userService.createUserOrThrow(params.username, params.password);
	}
}
