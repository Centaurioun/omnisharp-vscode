/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

let Subscriber: (message: string) => void;

export function SubscribeToAllLoggers(subscriber: (message: string) => void) {
    Subscriber = subscriber;
}

export class Logger {
    private _writer: (message: string) => void;
    private _prefix: string | undefined;

    private _indentLevel: number = 0;
    private _indentSize: number = 4;
    private _atLineStart: boolean = false;

    constructor(writer: (message: string) => void, prefix?: string) {
        this._writer = writer;
        this._prefix = prefix;
    }

    private _appendCore(message: string): void {
        if (this._atLineStart) {
            if (this._indentLevel > 0) {
                const indent = " ".repeat(this._indentLevel * this._indentSize);
                this.write(indent);
            }

            if (this._prefix !== undefined) {
                this.write(`[${this._prefix}] `);
            }

            this._atLineStart = false;
        }

        this.write(message);
    }

    public increaseIndent(): void {
        this._indentLevel += 1;
    }

    public decreaseIndent(): void {
        if (this._indentLevel > 0) {
            this._indentLevel -= 1;
        }
    }

    public append(message: string = ""): void {
        this._appendCore(message);
    }

    public appendLine(message: string = ""): void {
        this._appendCore(message + '\n');
        this._atLineStart = true;
    }

    private write(message: string) {
        this._writer(message);

        if (Subscriber) {
            Subscriber(message);
        }
    }
}
