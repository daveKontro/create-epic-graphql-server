export enum NodeEnv {
  production = 'production',
  test = 'test',
  development = 'development',
}

export enum LogLevel {
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'http',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}

export enum LogFile {
  combined = 'combined',
  error = 'error',
}

export enum OrderName {
  productOne = 'Product One',
  productTwo = 'Product Two',
  productThree = 'Product Three',
}

export enum OrderStatus {
  notStarted = 'Not Started',
  processing = 'Processing',
  sent = 'Sent',
}

export enum DataSet {
  customers = 'customers',
  orders = 'orders',
}
