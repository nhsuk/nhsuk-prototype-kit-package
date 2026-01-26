import express from 'express'
import session from 'express-session'
import {
  type ApplicationData,
  type ApplicationLocals
} from 'nhsuk-prototype-kit'

declare module 'express-serve-static-core' {
  interface Locals extends ApplicationLocals {
    data: Record<string, unknown> & ApplicationData
  }
}

declare module 'express-session' {
  interface SessionData {
    data: Record<string, unknown> & ApplicationData
  }
}
