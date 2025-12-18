/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Readable } from 'stream';

export class DownloadDirectoryResponse {
	public readonly name: string;

	public readonly mimeType: string;

	public readonly readable: Readable;

	private constructor(name: string, mimeType: string, readable: Readable) {
		this.name = name;
		this.mimeType = mimeType;
		this.readable = readable;
	}

	public static from(name: string, mimeType: string, readable: Readable): DownloadDirectoryResponse {
		return new DownloadDirectoryResponse(name, mimeType, readable);
	}
}
