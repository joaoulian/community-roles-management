import 'express';
import { Context } from '@shared/core/application/Context';

interface Locals {
  user?: Context;
}

declare module 'express' {
  export interface Response {
    locals: Locals;
  }
}
