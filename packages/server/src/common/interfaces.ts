import { NextFunction, Request, Response } from 'express';
import WebSocket from 'ws';

export interface IErrorWithCode extends Error {
	code?: string | number;
}

export interface IAsyncRequestHandler {
	(req: Request, res: Response, next: NextFunction): Promise<unknown>;
}

export const isErrorWithCode = (
	error: IErrorWithCode
): error is IErrorWithCode => error.code !== undefined;

export interface IListener {
	(this: WebSocket, data: WebSocket.RawData, isBinary: boolean): void;
}
