import express from 'express'
import session from 'express-session'
import { type ObjectNested } from 'nhsuk-frontend'
import {
  type ApplicationData,
  type ApplicationLocals
} from 'nhsuk-prototype-kit'

declare module 'express-serve-static-core' {
  interface Locals extends ApplicationLocals {
    data: ObjectNested & ApplicationData
  }
}

declare module 'express-session' {
  interface SessionData {
    data: ObjectNested & ApplicationData
  }
}
