#!/usr/bin/env node
import { type Options as PrettierOptions } from 'prettier';
interface ResourceOptions {
    name: string;
    url: string;
}
export interface SwaggerConfig {
    ext?: 'd.ts' | 'ts';
    output?: string;
    resources: ResourceOptions[];
    prettier?: Pick<PrettierOptions, 'semi' | 'singleQuote'>;
}
export {};
