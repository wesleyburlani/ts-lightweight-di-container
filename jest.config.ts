import { Config } from "jest"

const config: Config = 
{
  roots: [
    "./src"
  ],
  transform: {
    "^.+\.(t|j)s$": "ts-jest"
  },
  forceExit: true,
  detectOpenHandles: true,
  testMatch: [
    "**/*.e2e-spec.ts",
    "**/*.spec.ts"
  ],
  moduleFileExtensions: [
    "ts",
    "js",
    "json",
    "node"
  ],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/src/$1"
  },
}
  
export default config;