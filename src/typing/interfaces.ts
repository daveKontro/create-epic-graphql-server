import type { Customer } from '../models/Customer'
import type { Order } from '../models/Order'
import type * as enums from './enums'
import type * as types from './types'

interface DataSetOptions {
  dataSet: enums.DataSet,
}

export interface UpdateOptions {
  update: Partial<Customer>|Partial<Order>,
}

interface IdOptions {
  id: types.Id,
}

interface DocOptions {
  doc: Customer | Order,
}

export interface FilterOptions {
  filter?: Record<string, string>,
}

export interface Create extends DataSetOptions, DocOptions {}

export interface Read extends DataSetOptions, FilterOptions {}

export interface ReadOne extends Read, IdOptions {}

export interface Update extends DataSetOptions, IdOptions, UpdateOptions {}

export interface Delete extends DataSetOptions, IdOptions {}

export interface ErrorHandler {
  header?: types.Msg,
  err: types.Err,
}

export interface LogErr extends ErrorHandler {
  meta?: object,
  level?: enums.LogLevel.warn | enums.LogLevel.error,
}

export interface User {
  id: string,
  roles: string[],
}
