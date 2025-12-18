/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { UnauthorizedException } from "@nestjs/common";

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super("token expired");
  }
}
