import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';

// react-router v7 cần TextEncoder, jsdom chưa có sẵn
Object.assign(globalThis, { TextEncoder, TextDecoder });
