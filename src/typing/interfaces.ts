import type { Customer } from '../models/Customer'
import type { Order } from '../models/Order'
import type * as enums from './enums'
import type * as types from './types'

interface DataSetOptions {
  dataSet: enums.DataSet,
}

interface Patch {
  patch: Partial<Customer>|Partial<Order>,
}

export interface Id {
  id: string,
}

export interface Doc {
  doc: Customer | Order,
}

export interface Filter {
  filter?: Record<string, string>,
}

export interface Create extends DataSetOptions, Doc {}

export interface Read extends DataSetOptions, Filter {}

export interface ReadOne extends Read, Id {}

export interface Update extends DataSetOptions, Id, Patch {}

export interface Delete extends DataSetOptions, Id {}

export interface ErrorHandler {
  header?: types.Msg,
  err: types.Err,
}

export interface LogErr extends ErrorHandler {
  meta?: object,
  level?: enums.LogLevel.warn | enums.LogLevel.error,
}
